import { ComponentItem, FaultScenario, Course, QuizQuestion } from './types';

export const COMPONENTS: ComponentItem[] = [
  {
    id: 'plc-1',
    name: 'PLC (Programmable Logic Controller)',
    category: 'Kontrolör',
    description: 'Endüstriyel otomasyonun beynidir. Giriş verilerini işleyip çıkışları kontrol eder.',
    principle: 'Sıralı tarama döngüsü (Scan Cycle) mantığıyla çalışır: Girişleri oku, programı yürüt, çıkışları yaz.',
    usage: 'Konveyör hatları, paketleme makineleri, robot kontrollleri.',
    wiring: '24V DC besleme, Digital Input (PNP/NPN), Digital Output (Relay/Transistor).',
    faults: ['Enerji yok', 'Stop lambası yanıyor', 'Giriş gelmiyor', 'Output kısa devre'],
    specs: {
      'İşlemci': 'Dual-Core Industrial',
      'RAM': '2MB',
      'Haberleşme': 'Profinet, Modbus TCP',
      'I/O': '14 In / 10 Out (Genişletilebilir)'
    },
    aiNote: 'Modern PLC\'ler artık Edge Computing yetenekleri ile buluta veri aktarabilmektedir.'
  },
  {
    id: 'contact-1',
    name: 'Kontaktör',
    category: 'Güç Kontrol',
    description: 'Büyük elektrik yüklerini (genellikle motorlar) anahtarlamak için kullanılır.',
    principle: 'Bobin enerjilendiğinde oluşan manyetik alan kontakları çeker, devreyi tamamlar.',
    usage: 'Motor yol verme, ısıtıcı kontrolü.',
    wiring: 'A1-A2 Bobin ucları, L1-L2-L3 Şebeke girişi, T1-T2-T3 Motor çıkışı.',
    faults: ['Bobin yanığı', 'Kontak yapışması', 'Gürültülü çalışma (Ark)'],
    specs: {
      'Bobin Gerilimi': '220V AC / 24V DC',
      'Amper': '9A - 500A+',
      'Kutup Sayısı': '3 Ana + 1 Yardımcı'
    },
    aiNote: 'Termik röle ile birlikte kullanılması, motorun aşırı akımdan korunması için kritiktir.'
  },
  {
    id: 'sensor-1',
    name: 'İndüktif Sensör',
    category: 'Sensör',
    description: 'Metal cisimleri temas etmeden algılayan sensördür.',
    principle: 'Elektromanyetik alan değişimi prensibine göre çalışır. Sadece iletken maddelere duyarlıdır.',
    usage: 'Pozisyon algılama, parça sayma.',
    wiring: 'Kahverengi (+), Mavi (-), Siyah (Signal - PNP/NPN).',
    faults: ['Kablo kopukluğu', 'Algılama mesafesi bozulması', 'Sürekli sinyal'],
    specs: {
      'Gövde': 'M12 / M18',
      'Mesafe': '4mm - 12mm',
      'Frekans': '1000 Hz'
    },
    aiNote: 'Nemli ve yağlı ortamlarda en yüksek dayanıklılığa sahip sensör tipidir.'
  }
];

export const FAULT_SCENARIOS: FaultScenario[] = [
  {
    id: 'sc-1',
    title: 'Ana Motor Çalışmıyor',
    description: 'Operatör başlatma butonuna basıyor ancak M1 motoru hareket etmiyor.',
    steps: [
      {
        id: 'step-1',
        question: 'Kumanda panosunda enerji lambası yanıyor mu?',
        options: [
          { label: 'Evet', nextStepId: 'step-2' },
          { label: 'Hayır', result: {
            diagnosis: 'Ana Besleme Arızası',
            solution: 'Ana şalteri ve giriş sigortalarını kontrol edin.',
            riskLevel: 'High',
            estimatedTime: '15 Dakika',
            aiComment: 'Besleme gelmeden diğer komponentlere bakmak zaman kaybıdır.'
          }}
        ]
      },
      {
        id: 'step-2',
        question: 'Start butonuna basıldığında PLC giriş LED\'i yanıyor mu?',
        options: [
          { label: 'Evet', nextStepId: 'step-3' },
          { label: 'Hayır', result: {
            diagnosis: 'Buton veya Kablo Arızası',
            solution: 'Start butonunun kontaklarını ve kablo sürekliliğini ölçün.',
            riskLevel: 'Medium',
            estimatedTime: '10 Dakika',
            aiComment: 'Fiziksel butonlar mekanik ömürlerini tamamlamış olabilir.'
          }}
        ]
      },
      {
        id: 'step-3',
        question: 'Kontaktör çekiyor mu?',
        options: [
          { label: 'Evet', result: {
            diagnosis: 'Motor veya Güç Devresi Arızası',
            solution: 'Motor klemensini ve termik rölenin atıp atmadığını kontrol edin.',
            riskLevel: 'High',
            estimatedTime: '30 Dakika',
            aiComment: 'Kontaktör çekiyorsa sorun PLC sonrası güç katındadır.'
          }},
          { label: 'Hayır', result: {
            diagnosis: 'PLC Çıkış veya Röle Arızası',
            solution: 'PLC çıkış modulünü ve yardımcı röleyi test edin.',
            riskLevel: 'Medium',
            estimatedTime: '20 Dakika',
            aiComment: 'Ara rölelerde soket gevşemesi sık görülen bir durumdur.'
          }}
        ]
      }
    ]
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'PLC\'de "Ladder Logic" neyi ifade eder?',
    options: ['Merdiven şeklinde bir merdiven yapma', 'Grafiksel programlama dili', 'Donanım montaj şeması', 'Veritabanı yapısı'],
    correctAnswer: 1
  },
  {
    id: 'q2',
    question: 'Bir motorun aşırı akımdan zarar görmemesi için hangisi kullanılır?',
    options: ['Kapasitör', 'Termik Röle', 'Varyak', 'Endüktans'],
    correctAnswer: 1
  },
  {
    id: 'q3',
    question: 'NPN bir sensörde sinyal ucu hangi polaritedir?',
    options: ['Pozitif (+)', 'Negatif (-)', 'Nötr', 'Toprak'],
    correctAnswer: 1
  }
];

export const ACADEMY_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'PLC Temelleri: Giriş',
    category: 'PLC',
    duration: '2s 15dk',
    level: 'Başlangıç',
    progress: 45,
    aiNotes: 'Bu kurs sonrası temel bir lojik devreyi PLC\'ye aktarabileceksiniz.',
    thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'c2',
    title: 'Ladder Logic ile Algoritma',
    category: 'PLC',
    duration: '4s 30dk',
    level: 'Orta',
    progress: 10,
    aiNotes: 'Zamanlayıcı ve sayıcı fonksiyonlarını derinlemesine işler.',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'c3',
    title: 'Endüstriyel Sensörler',
    category: 'Sensör',
    duration: '1s 45dk',
    level: 'Başlangıç',
    progress: 0,
    aiNotes: 'Optik, indüktif ve ultrasonik farklarını öğrenin.',
    thumbnail: 'https://images.unsplash.com/photo-159742324403d-d421894a4c51?auto=format&fit=crop&q=80&w=400'
  }
];
