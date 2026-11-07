import { useEffect, useState } from 'react';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { MobileNavigation } from './components/layout/MobileNavigation';
import { agencies } from './data/agencies';
import { useRequests } from './hooks/useRequests';
import { useScanner } from './hooks/useScanner';
import { AgenciesPage } from './pages/AgenciesPage';
import { CreateRequestPage } from './pages/CreateRequestPage';
import { GuidePage } from './pages/GuidePage';
import { HomePage } from './pages/HomePage';
import { ReceiptPage } from './pages/ReceiptPage';
import { RequestsPage } from './pages/RequestsPage';
import { ScannerPage } from './pages/ScannerPage';
import type { RecyclingRequest, RequestFormValues, View } from './types';

const emptyForm: RequestFormValues = { material: '', quantityKg: '5', agencyId: agencies[0].id, notes: '', photoUrl: '' };

export default function App() {
  const [view, setView] = useState<View>('home');
  const [returnToRequest, setReturnToRequest] = useState(false);
  const [formValues, setFormValues] = useState<RequestFormValues>(emptyForm);
  const [receipt, setReceipt] = useState<RecyclingRequest | null>(null);
  const { requests, setRequests, storageError } = useRequests();
  const scanner = useScanner();

  useEffect(() => {
    if (view !== 'scanner') {
      scanner.stopCamera();
      scanner.cancelAnalysis();
    }
  }, [view, scanner.stopCamera, scanner.cancelAnalysis]);

  const createFromAnalysis = () => {
    if (!scanner.analysis || scanner.analysis.status !== 'identified' || !scanner.analysis.material) return;
    setReturnToRequest(false);
    setFormValues({
      material: `${scanner.analysis.material} — ${scanner.analysis.specific || scanner.analysis.object || 'Residuo'}`,
      quantityKg: '5', agencyId: agencies[0].id,
      notes: `Estado: ${scanner.analysis.visibleCondition || 'Visible'}. Preparado según guía de EcoCircular.`,
      photoUrl: scanner.image ?? '',
    });
    setView('create-request');
  };

  const createFromAgency = (agencyId: string, materials: string[]) => {
    setFormValues((current) => ({ ...current, agencyId, material: current.material || materials[0] }));
    setView('create-request');
  };

  const submitRequest = (values: RequestFormValues) => {
    const agency = agencies.find((item) => item.id === values.agencyId) ?? agencies[0];
    const request: RecyclingRequest = {
      id: `SOL-${Date.now().toString().slice(-8)}`,
      date: formatBoliviaDate(new Date()),
      material: values.material || 'Material mixto reciclable',
      quantityKg: values.quantityKg,
      agency: `${agency.name} (${agency.city})`,
      status: 'Pendiente',
      photoUrl: values.photoUrl || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
      notes: values.notes || 'Sin observaciones adicionales',
    };
    setRequests((current) => [request, ...current]);
    setReceipt(request);
    setView('receipt');
  };

  const showReceipt = (request: RecyclingRequest) => {
    setReceipt(request);
    setView('receipt');
  };

  const useScannerPhotoForRequest = () => {
    if (!scanner.image) return;
    setFormValues((current) => ({ ...current, photoUrl: scanner.image ?? '' }));
    setReturnToRequest(false);
    setView('create-request');
  };

  return <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
    <Header view={view} requestCount={requests.length} onNavigate={setView} />
    <main className="flex-1 pb-20 md:pb-0">
      {view === 'home' && <HomePage onNavigate={setView} />}
      {view === 'scanner' && <ScannerPage
        videoRef={scanner.videoRef}
        image={scanner.image}
        analysis={scanner.analysis}
        cameraActive={scanner.cameraActive}
        cameraError={scanner.cameraError}
        analysisError={scanner.analysisError}
        fileError={scanner.fileError}
        imageValidation={scanner.imageValidation}
        validationMessage={scanner.validationMessage}
        canUsePhotoForRequest={returnToRequest}
        analyzing={scanner.analyzing}
        onStartCamera={scanner.startCamera}
        onStopCamera={scanner.stopCamera}
        onCapture={scanner.capturePhoto}
        onImageFile={(file) => void scanner.selectImageFile(file)}
        onUsePhotoForRequest={useScannerPhotoForRequest}
        onSelectSample={scanner.selectSample}
        onAnalyze={() => void scanner.analyze()}
        onCreateRequest={createFromAnalysis}
      />}
      {view === 'agencies' && <AgenciesPage onSelectAgency={(agency) => createFromAgency(agency.id, agency.materials)} />}
      {view === 'guide' && <GuidePage />}
      {view === 'requests' && <RequestsPage requests={requests} storageError={storageError} onNewRequest={() => setView('create-request')} onViewReceipt={showReceipt} />}
      {view === 'create-request' && <CreateRequestPage initialValues={formValues} onSubmit={submitRequest} onBack={() => setView('agencies')} onGoToScanner={(values) => { setFormValues(values); setReturnToRequest(true); setView('scanner'); }} />}
      {view === 'receipt' && receipt && <ReceiptPage request={receipt} onViewHistory={() => setView('requests')} />}
    </main>
    <Footer onNavigate={setView} />
    <MobileNavigation view={view} requestCount={requests.length} onNavigate={setView} />
  </div>;
}

function formatBoliviaDate(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/La_Paz', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${value.year}-${value.month}-${value.day} ${value.hour}:${value.minute}`;
}
