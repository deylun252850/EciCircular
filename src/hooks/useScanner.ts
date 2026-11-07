import { useCallback, useEffect, useRef, useState } from 'react';
import { analyzeWithGemini } from '../services/geminiService';
import { readImageFile, validateImageDataUrl } from '../services/imageService';
import type { WasteAnalysis, WasteSample } from '../types';

export function useScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cameraRequestRef = useRef(0);
  const imageSelectionRef = useRef(0);
  const analysisAbortRef = useRef<AbortController | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<WasteAnalysis | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [analysisError, setAnalysisError] = useState('');
  const [fileError, setFileError] = useState('');
  const [imageValidation, setImageValidation] = useState<'empty' | 'validating' | 'ready' | 'invalid'>('empty');
  const [validationMessage, setValidationMessage] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const cancelAnalysis = useCallback(() => {
    analysisAbortRef.current?.abort();
    analysisAbortRef.current = null;
    setAnalyzing(false);
  }, []);

  const stopCamera = useCallback(() => {
    cameraRequestRef.current += 1;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraActive(false);
  }, []);

  useEffect(() => {
    if (videoRef.current && streamRef.current) videoRef.current.srcObject = streamRef.current;
  }, [cameraActive]);

  useEffect(() => () => {
    stopCamera();
    analysisAbortRef.current?.abort();
  }, [stopCamera]);

  const startCamera = async () => {
    setCameraError('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Este navegador no permite acceder a la cámara. Usa la carga de archivos.');
      return;
    }
    const requestId = ++cameraRequestRef.current;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      if (requestId !== cameraRequestRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      setCameraActive(true);
    } catch {
      if (requestId !== cameraRequestRef.current) return;
      setCameraError('No se pudo acceder a la cámara. Revisa los permisos o utiliza la carga de archivos.');
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    void selectImage(canvas.toDataURL('image/jpeg', 0.85));
    stopCamera();
  };

  const selectImage = async (imageData: string) => {
    const selectionId = ++imageSelectionRef.current;
    cancelAnalysis();
    setImage(imageData);
    setAnalysis(null);
    setAnalysisError('');
    setFileError('');
    setImageValidation('validating');
    setValidationMessage('Imagen recibida. Comprobando calidad y formato...');
    stopCamera();
    try {
      await validateImageDataUrl(imageData);
      if (selectionId !== imageSelectionRef.current) return;
      setImageValidation('ready');
      setValidationMessage('La imagen pasó las comprobaciones iniciales y está lista para analizarse. Esto no confirma que contenga un residuo.');
    } catch (error) {
      if (selectionId !== imageSelectionRef.current) return;
      setImageValidation('invalid');
      setValidationMessage(error instanceof Error ? error.message : 'No se pudo validar la imagen.');
    }
  };

  const selectImageFile = async (file?: File) => {
    if (!file) return;
    const selectionId = ++imageSelectionRef.current;
    cancelAnalysis();
    try {
      const imageData = await readImageFile(file);
      if (selectionId !== imageSelectionRef.current) return;
      await selectImage(imageData);
    } catch (error) {
      if (selectionId !== imageSelectionRef.current) return;
      setImage(null);
      setAnalysis(null);
      setImageValidation('invalid');
      setFileError(error instanceof Error ? error.message : 'No se pudo leer la imagen.');
      setValidationMessage('');
    }
  };

  const selectSample = (sample: WasteSample) => {
    imageSelectionRef.current += 1;
    cancelAnalysis();
    setImage(sample.imageUrl);
    setImageValidation('invalid');
    setValidationMessage('Esta es una muestra demostrativa preconfigurada; no se enviará a Gemini ni representa un análisis de la fotografía seleccionada.');
    setAnalysisError('');
    setFileError('');
    stopCamera();
    setAnalysis({ ...sample.analysis, isDemo: true, demoNote: 'Muestra de prueba preconfigurada para exhibición.' });
  };

  const analyze = async () => {
    if (!image || imageValidation !== 'ready' || analysis?.isDemo) return;
    cancelAnalysis();
    const controller = new AbortController();
    analysisAbortRef.current = controller;
    const timeoutId = window.setTimeout(() => controller.abort(new Error('Se agotó el tiempo de espera del análisis.')), 45000);
    setAnalyzing(true);
    setAnalysis(null);
    setAnalysisError('');
    try {
      const result = await analyzeWithGemini(image, controller.signal);
      if (controller.signal.aborted) return;
      setAnalysis(result);
      if (result.status === 'error') {
        setAnalysisError(result.explanation || 'Ocurrió un error técnico durante el análisis.');
      }
    } catch (error) {
      if (controller.signal.aborted && analysisAbortRef.current !== controller) return;
      if (controller.signal.aborted) {
        setAnalysisError('El análisis tardó demasiado y se canceló. Revisa tu conexión e inténtalo nuevamente.');
      } else {
        const message = error instanceof Error ? error.message : 'No se pudo analizar la imagen.';
        setAnalysis({
          status: 'error',
          object: null,
          material: null,
          specific: null,
          resinCode: null,
          visibleCondition: null,
          confidence: null,
          recyclable: false,
          explanation: message,
          recommendations: ['Intenta con una fotografía más clara y centrada en el objeto.'],
          reuseIdeas: [],
          warnings: ['No se debe presentar un resultado inventado cuando la imagen no es analizable.'],
        });
        setAnalysisError(message);
      }
    } finally {
      window.clearTimeout(timeoutId);
      if (analysisAbortRef.current === controller) {
        analysisAbortRef.current = null;
        setAnalyzing(false);
      }
    }
  };

  return { videoRef, image, analysis, cameraActive, cameraError, analysisError, fileError, imageValidation, validationMessage, analyzing, startCamera, stopCamera, cancelAnalysis, capturePhoto, selectImage, selectImageFile, selectSample, analyze };
}
