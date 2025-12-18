import React, { useState, useMemo, useEffect } from 'react';
import { User, MapPin, HelpCircle, Package, Phone, CreditCard, ChevronLeft, Percent } from 'lucide-react';

// --- DATA LAYER (MOCKED) ---

// Обновленная структура данных для всех компонентов
const MOCK_DATA = {
  appSettings: {
    currency: '₽',
    appName: 'Lavka Daily',
    primaryColor: '#02ADFF'
  },
  navButtons: [
    { id: 'packs', label: 'Наборы', icon: <Package size={16} /> },
    { id: 'zone', label: 'Зона Доставки', icon: <MapPin size={16} /> },
    { id: 'faq', label: 'FAQ', icon: <HelpCircle size={16} /> }
  ],
  dietPlans: [
    {
      id: 'normal',
      title: 'Обычный',
      subtitle: 'Классический рацион',
      allowedMealCounts: [3, 4, 5, 6], // Разрешено 3-6 блюд
      macros: { calories: 2000, protein: 100, fat: 80, carbs: 200 }
    },
    {
      id: 'lowcal',
      title: 'Мало калорий',
      subtitle: 'Для снижения веса',
      allowedMealCounts: [3, 4], // Разрешено только 3-4 блюда
      macros: { calories: 1400, protein: 110, fat: 60, carbs: 80 }
    },
    {
      id: 'sport',
      title: 'Спорт',
      subtitle: 'Для набора массы',
      allowedMealCounts: [5, 6], // Разрешено только 5-6 блюд
      macros: { calories: 2500, protein: 180, fat: 90, carbs: 250 }
    },
    {
      id: 'vegan',
      title: 'Веган',
      subtitle: 'Растительное питание',
      allowedMealCounts: [3, 4, 5], // Разрешено 3-5 блюд
      macros: { calories: 1600, protein: 80, fat: 70, carbs: 180 }
    }
  ],
  dishes: [
    {
      id: 101,
      name: 'Сырники с ягодами и сметаной',
      type: 'Завтрак',
      calories: 404,
      protein: 18,
      fat: 22,
      carbs: 32,
      weight: 180,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80',
      rationIds: ['normal', 'sport', 'vegan'] 
    },
    {
      id: 102,
      name: 'Куриный суп с домашней лапшой',
      type: 'Обед',
      calories: 255,
      protein: 16,
      fat: 8,
      carbs: 28,
      weight: 250,
      image: 'https://images.unsplash.com/photo-1547592166-23acbe3a624b?auto=format&fit=crop&w=400&q=80',
      rationIds: ['normal', 'lowcal']
    },
    {
      id: 103,
      name: 'Стейк из лосося с киноа',
      type: 'Ужин',
      calories: 600,
      protein: 42,
      fat: 28,
      carbs: 38,
      weight: 180,
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&w=400&q=80',
      rationIds: ['normal', 'lowcal', 'sport']
    },
    {
      id: 104,
      name: 'Котлеты Пожарские с пюре',
      type: 'Ужин',
      calories: 700,
      protein: 35,
      fat: 32,
      carbs: 58,
      weight: 300,
      image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80',
      rationIds: ['normal', 'sport']
    },
    {
      id: 105,
      name: 'Боул с авокадо и тофу',
      type: 'Обед',
      calories: 450,
      protein: 20,
      fat: 24,
      carbs: 38,
      weight: 220,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
      rationIds: ['vegan', 'lowcal']
    }
  ],
  tomorrowDishes: [
    {
      id: 201,
      name: 'Омлет с овощами и сыром',
      type: 'Завтрак',
      calories: 380,
      protein: 22,
      fat: 24,
      carbs: 18,
      weight: 200,
      image: 'https://images.unsplash.com/photo-1613564834361-1e5c8b8b5e5e?auto=format&fit=crop&w=400&q=80',
      rationIds: ['normal', 'sport', 'lowcal']
    },
    {
      id: 202,
      name: 'Борщ с говядиной и сметаной',
      type: 'Обед',
      calories: 320,
      protein: 20,
      fat: 12,
      carbs: 32,
      weight: 280,
      image: 'https://images.unsplash.com/photo-1547592166-23acbe3a624b?auto=format&fit=crop&w=400&q=80',
      rationIds: ['normal', 'sport']
    },
    {
      id: 203,
      name: 'Гречка с куриной грудкой',
      type: 'Ужин',
      calories: 520,
      protein: 45,
      fat: 15,
      carbs: 48,
      weight: 250,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=400&q=80',
      rationIds: ['normal', 'sport', 'lowcal']
    },
    {
      id: 204,
      name: 'Паста карбонара',
      type: 'Ужин',
      calories: 650,
      protein: 28,
      fat: 35,
      carbs: 55,
      weight: 300,
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=400&q=80',
      rationIds: ['normal', 'sport']
    },
    {
      id: 205,
      name: 'Салат с киноа и овощами',
      type: 'Обед',
      calories: 320,
      protein: 12,
      fat: 18,
      carbs: 32,
      weight: 200,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
      rationIds: ['vegan', 'lowcal']
    },
    {
      id: 206,
      name: 'Творожная запеканка с ягодами',
      type: 'Завтрак',
      calories: 420,
      protein: 20,
      fat: 18,
      carbs: 42,
      weight: 220,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80',
      rationIds: ['normal', 'sport']
    }
  ],
  faq: [
    {
      id: 1,
      question: 'Как происходит доставка?',
      answer: 'Доставка происходит раз в три дня с 6:00 до 12:00, в любой удобный интервал. Доставка бесплатная при заказе от 2000₽.'
    },
    {
      id: 2,
      question: 'Можно ли изменить состав рациона?',
      answer: 'Да, вы можете настроить рацион под свои предпочтения. Выбирайте количество блюд и тип питания (обычный, спорт, веган, низкокалорийный).'
    },
    {
      id: 3,
      question: 'Как часто обновляется меню?',
      answer: 'Меню обновляется ежедневно. Мы предлагаем разнообразные блюда, чтобы вы не уставали от однообразия.'
    },
    {
      id: 4,
      question: 'Можно ли отменить заказ?',
      answer: 'Да, вы можете отменить заказ до 18:00 дня, предшествующего дню доставки. Отмена доступна в личном кабинете или по телефону поддержки.'
    },
    {
      id: 5,
      question: 'Как хранить блюда?',
      answer: 'Все блюда упакованы в герметичные контейнеры и могут храниться в холодильнике до 3 дней. Перед употреблением разогрейте в микроволновке или на плите.'
    }
  ],
  deliveryZones: [
    { id: 1, name: 'Центральный район', areas: ['Центр', 'Кремль', 'Красная площадь'], deliveryTime: '30-45 мин', minOrder: 1500 },
    { id: 2, name: 'Северный район', areas: ['Северное шоссе', 'Парк Победы', 'Спортивная'], deliveryTime: '45-60 мин', minOrder: 2000 },
    { id: 3, name: 'Южный район', areas: ['Южный парк', 'Набережная', 'Промзона'], deliveryTime: '40-55 мин', minOrder: 1800 },
    { id: 4, name: 'Восточный район', areas: ['Восточный проспект', 'Студенческий', 'Заводской'], deliveryTime: '50-70 мин', minOrder: 2000 },
    { id: 5, name: 'Западный район', areas: ['Западный бульвар', 'Садовая', 'Новый город'], deliveryTime: '35-50 мин', minOrder: 1700 }
  ]
};

// --- TYPE DEFINITIONS for clarity (VIBE-CODING) ---
/** @typedef {{id: string, title: string, subtitle: string, allowedMealCounts: number[], macros: {calories: number, protein: number, fat: number, carbs: number}}} DietPlan */
/** @typedef {{id: number, name: string, type: string, calories: number, protein: number, fat: number, carbs: number, weight: number, image: string, rationIds: string[]}} Meal */

// Utility function to round to nearest hundred
const roundToHundred = (num) => {
  return Math.round(num / 100) * 100;
};

// --- UI COMPONENTS ---

// Logo Component (Органическая форма - сердце/облако)
const Logo = ({ size = 32 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-sm"
  >
    {/* Синий фон (круг) */}
    <circle cx="50" cy="50" r="50" fill="#02ADFF"/>
    {/* Белая органическая форма: две закругленные лопасти сверху с выемкой, закругленное основание */}
    <path 
      d="M50 22
         C45 22, 38 24, 35 30
         C33 33, 33 36, 35 38
         C32 40, 30 43, 30 47
         C30 50, 32 53, 35 55
         C37 57, 40 58, 43 58
         C45 60, 47 61, 50 61
         C53 61, 55 60, 57 58
         C60 58, 63 57, 65 55
         C68 53, 70 50, 70 47
         C70 43, 68 40, 65 38
         C67 36, 67 33, 65 30
         C62 24, 55 22, 50 22 Z" 
      fill="white"
    />
  </svg>
);

// 1. TopNavBar (Верхняя панель с лого и профилем + меню пользователя)
const TopNavBar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleUserMenu = () => {
    setIsUserMenuOpen((prev) => !prev);
  };

  const closeUserMenu = () => {
    setIsUserMenuOpen(false);
  };

  return (
    <div className="sticky top-0 z-50 bg-[#F0F9FF]/95 backdrop-blur-sm px-4 py-3 flex items-center justify-center shadow-sm border-b border-blue-100 relative">
      {/* Logo Centered */}
      <div className="flex items-center gap-2">
        <span className="font-bold text-slate-800 text-xl tracking-tight">Лавка</span>
        <Logo size={40} />
        <span className="font-bold text-slate-800 text-xl tracking-tight">Дейли</span>
      </div>
      
      {/* Right Side Icons - Кнопка профиля */}
      <button
        onClick={toggleUserMenu}
        className="absolute right-4 flex items-center justify-center bg-white/50 w-8 h-8 rounded-full text-slate-600 active:scale-90 transition-transform"
      >
        <User size={18} />
      </button>

      {/* Выпадающее меню пользователя */}
      {isUserMenuOpen && (
        <>
          {/* Полупрозрачный фон для клика вне меню */}
          <button
            onClick={closeUserMenu}
            className="fixed inset-0 z-40 bg-black/10 cursor-default"
          />

          <div className="absolute right-4 top-12 z-50 w-56 bg-white rounded-2xl shadow-xl border border-blue-100 py-2">
            <div className="px-4 py-2 border-b border-blue-50">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Аккаунт</p>
              <p className="text-sm font-semibold text-slate-800">Иван Иванов</p>
              <p className="text-xs text-slate-500">+7 999 123-45-67</p>
            </div>

            <button
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-blue-50 flex items-center gap-2"
            >
              <span>Профиль</span>
            </button>
            <button
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-blue-50 flex items-center gap-2"
            >
              <span>Мои заказы</span>
            </button>
            <button
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-blue-50 flex items-center gap-2"
            >
              <span>Способы оплаты</span>
            </button>

            <div className="border-t border-blue-50 mt-1 pt-1">
              <button
                className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50"
              >
                Выйти
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// 2. QuickActionsBar (Панель быстрых действий)
/**
 * @param {{onScrollTo: (id: string) => void}} props
 */
const QuickActionsBar = ({ onScrollTo }) => {
  const handleClick = (btnId) => {
    onScrollTo(btnId);
  };

  return (
    <div className="py-4 px-4 flex gap-3 justify-between bg-[#F0F9FF]">
      {MOCK_DATA.navButtons.map((btn) => (
        <button 
          key={btn.id}
          onClick={() => handleClick(btn.id)}
          className="flex-1 bg-white border border-blue-100 shadow-sm py-3 rounded-xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
        >
          <div className="text-[#02ADFF]">{btn.icon}</div>
          <span className="text-xs font-bold text-slate-700">{btn.label}</span>
        </button>
      ))}
    </div>
  );
};

// 3. RationPromoBanner (Крупный промо-баннер)
const RationPromoBanner = () => (
  <div className="px-4 pb-4">
    <div className="bg-[#E0F2FE] rounded-[32px] p-6 relative overflow-hidden min-h-[200px] flex flex-col justify-center">
      <div className="relative z-10">
        <h1 className="text-4xl font-black text-slate-900 leading-[0.95] mb-4 uppercase tracking-tight">
          ГОТОВКА —<br/><span className="text-[#02ADFF]">ВСЁ.</span>
        </h1>
        <p className="text-slate-600 text-base mb-6 leading-relaxed font-medium">
          Теперь доставляем готовые рационы!
        </p>
      </div>
    </div>
  </div>
);

// 4. DietPlanSelector (Вертикальный выбор типа питания)
/**
 * @param {{selectedId: string, onSelect: (id: string) => void, dynamicCalories: number}} props
 */
const DietPlanSelector = ({ selectedId, onSelect, dynamicCalories }) => {
  return (
    <div id="packs" className="px-4 mb-6 scroll-mt-20">
      {/* Scrollable Container with Snap */}
      <div className="flex flex-col gap-3 h-[220px] overflow-y-auto snap-y snap-mandatory no-scrollbar rounded-2xl">
        {MOCK_DATA.dietPlans.map((plan) => {
          const isSelected = selectedId === plan.id;
          
          // ИСПРАВЛЕНИЕ: Всегда используем базовые калории из плана.
          // Это убирает "скачок" цифр при клике.
          const displayCalories = plan.macros.calories;
          
          return (
            <div 
              key={plan.id}
              onClick={() => onSelect(plan.id)}
              className={`snap-center shrink-0 p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer relative overflow-hidden
                ${isSelected 
                  ? 'bg-white border-[#02ADFF] shadow-md scale-[1.0] opacity-100' 
                  : 'bg-white/60 border-transparent shadow-sm scale-[0.98] opacity-70 blur-[0.5px] hover:border-blue-100'}`}
            >
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <h3 className={`font-bold text-lg leading-tight ${isSelected ? 'text-[#02ADFF]' : 'text-slate-800'}`}>
                    {plan.title}
                  </h3>
                  <p className="text-xs text-slate-500">{plan.subtitle}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-800">~{roundToHundred(displayCalories)}</div>
                  <div className="text-[10px] text-slate-400">ккал</div>
                </div>
              </div>
              
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute inset-y-0 left-0 w-1 bg-[#02ADFF]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


// 5. PortionSizePicker (Выбор количества блюд)
/**
 * @param {{currentCount: number, allowedCounts: number[], onSelect: (count: number) => void}} props
 */
const PortionSizePicker = ({ currentCount, allowedCounts, onSelect }) => {
  if (!allowedCounts || allowedCounts.length === 0) return null; 

  return (
    <div className="px-4">
      <h2 className="text-lg font-bold text-slate-800 mb-3 px-1">Количество блюд</h2>
      <div className="flex justify-between bg-white p-1.5 rounded-2xl mb-8 shadow-sm border border-blue-50">
        {allowedCounts.map(count => (
          <button
            key={count}
            onClick={() => onSelect(count)}
            // 'flex-1' ensures buttons stretch equally
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200
              ${currentCount === count
                ? 'bg-[#02ADFF] text-white shadow-md'
                : 'bg-transparent text-slate-500 hover:bg-blue-50'}`}
          >
            {count} {count > 1 ? 'блюд' : 'блюдо'}
          </button>
        ))}
      </div>
    </div>
  );
};

// 5.5. DaysPicker (Выбор количества дней)
/**
 * @param {{currentDays: number, allowedDays: number[], onSelect: (days: number) => void}} props
 */
const DaysPicker = ({ currentDays, allowedDays, onSelect }) => {
  if (!allowedDays || allowedDays.length === 0) return null;

  return (
    <div className="px-4">
      <h2 className="text-lg font-bold text-slate-800 mb-3 px-1">Количество дней</h2>
      <div className="flex justify-between bg-white p-1.5 rounded-2xl mb-8 shadow-sm border border-yellow-50">
        {allowedDays.map(days => (
          <button
            key={days}
            onClick={() => onSelect(days)}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200
              ${currentDays === days
                ? 'bg-[#FDE000] text-black shadow-md'
                : 'bg-transparent text-slate-500 hover:bg-yellow-50'}`}
          >
            {days} {days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}
          </button>
        ))}
      </div>
    </div>
  );
};

// 6. MealCard (Карточка блюда без картинки)
/**
 * @param {{dish: Meal}} props
 */
const MealCard = ({ dish }) => (
  <div className="bg-white rounded-[24px] p-3 shadow-sm h-full flex flex-col border border-blue-50 hover:shadow-lg transition-shadow">
    {/* Вместо картинки — цветной блок с иконкой или инициалами */}
    <div className="relative aspect-square mb-3 rounded-2xl overflow-hidden bg-blue-50 flex items-center justify-center">
       <span className="text-4xl">🍽️</span>
    </div>
    
    <div className="flex-1 flex flex-col">
      <div className="text-[10px] uppercase font-bold tracking-wider text-blue-400 mb-1">
        {dish.type}
      </div>
      <h4 className="font-bold text-slate-900 text-sm leading-snug mb-auto line-clamp-2">
        {dish.name}
      </h4>
      <div className="mt-2 text-xs text-slate-500 font-medium">
        {dish.calories} ккал · {dish.weight} г
      </div>
    </div>
  </div>
);


// 7. FAQ Component (свернутый по умолчанию)
const FAQSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openQuestionId, setOpenQuestionId] = useState(null);

  const toggleQuestion = (id) => {
    setOpenQuestionId(openQuestionId === id ? null : id);
  };

  return (
    <div id="faq" className="px-4 mb-32 scroll-mt-20">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-white rounded-2xl border border-blue-100 shadow-sm p-4 flex items-center justify-between hover:bg-blue-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <HelpCircle size={20} className="text-[#02ADFF]" />
          <span className="font-bold text-slate-800 text-lg">FAQ</span>
        </div>
        <div className={`text-[#02ADFF] transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>
      
      {isExpanded && (
        <div className="mt-3 space-y-3">
          {MOCK_DATA.faq.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleQuestion(item.id)}
                className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-blue-50/50 transition-colors"
              >
                <span className="font-bold text-slate-800 text-sm pr-4">{item.question}</span>
                <div className={`text-[#02ADFF] transition-transform shrink-0 ${openQuestionId === item.id ? 'rotate-180' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
              {openQuestionId === item.id && (
                <div className="px-4 pb-4 pt-0">
                  <p className="text-sm text-slate-600 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 8. Delivery Zone Component (с иллюстрацией карты)
const DeliveryZoneSection = () => {
  return (
    <div id="zone" className="px-4 mb-6 scroll-mt-20">
      <div className="flex items-center gap-3 mb-4">
        <MapPin size={20} className="text-[#02ADFF]" />
        <h2 className="font-bold text-slate-800 text-lg">Зона доставки</h2>
      </div>
      
      {/* Иллюстрация карты */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
        <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 p-6 h-[200px] flex items-center justify-center">
          {/* Стилизованная карта */}
          <svg width="100%" height="100%" viewBox="0 0 300 200" className="absolute inset-0">
            {/* Фон карты */}
            <rect width="300" height="200" fill="#E0F2FE" />
            
            {/* Улицы/дороги */}
            <path d="M0 100 L300 100" stroke="#B3E5FC" strokeWidth="3" />
            <path d="M150 0 L150 200" stroke="#B3E5FC" strokeWidth="3" />
            <path d="M50 50 L250 150" stroke="#B3E5FC" strokeWidth="2" strokeDasharray="5,5" />
            <path d="M250 50 L50 150" stroke="#B3E5FC" strokeWidth="2" strokeDasharray="5,5" />
            
            {/* Зоны доставки (круги) */}
            <circle cx="80" cy="60" r="25" fill="#02ADFF" opacity="0.3" stroke="#02ADFF" strokeWidth="2" />
            <circle cx="220" cy="60" r="25" fill="#02ADFF" opacity="0.3" stroke="#02ADFF" strokeWidth="2" />
            <circle cx="150" cy="100" r="30" fill="#02ADFF" opacity="0.3" stroke="#02ADFF" strokeWidth="2" />
            <circle cx="80" cy="140" r="25" fill="#02ADFF" opacity="0.3" stroke="#02ADFF" strokeWidth="2" />
            <circle cx="220" cy="140" r="25" fill="#02ADFF" opacity="0.3" stroke="#02ADFF" strokeWidth="2" />
            
            {/* Маркеры */}
            <circle cx="80" cy="60" r="4" fill="#02ADFF" />
            <circle cx="220" cy="60" r="4" fill="#02ADFF" />
            <circle cx="150" cy="100" r="4" fill="#02ADFF" />
            <circle cx="80" cy="140" r="4" fill="#02ADFF" />
            <circle cx="220" cy="140" r="4" fill="#02ADFF" />
          </svg>
          
          {/* Текст поверх карты */}
          <div className="relative z-10 text-center">
            <MapPin size={32} className="text-[#02ADFF] mx-auto mb-2" />
            <p className="text-xs text-slate-600 font-medium">Карта зон доставки</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 9. PaymentSheet (Нижний экран "Адрес и оплата")
/**
 * @param {{ 
 *  totalPrice: number; 
 *  selectedMealCount: number;
 *  selectedDays: number;
 *  onClose: () => void;
 *  onPay: () => void;
 * }} props
 */
const PaymentSheet = ({ totalPrice, selectedMealCount, selectedDays, onClose, onPay }) => {
  const [address, setAddress] = useState('Санкт-Петербургское шоссе, 109литО');
  const [contact, setContact] = useState('');
  const [leaveAtDoor, setLeaveAtDoor] = useState(false);
  const [callIfMissing, setCallIfMissing] = useState(true);
  const [selectedPaymentIndex, setSelectedPaymentIndex] = useState(0);
  const [selectedTipIndex, setSelectedTipIndex] = useState(0);
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const rawTotal = promoApplied ? Math.round(totalPrice / 0.8) : totalPrice;
  const discountAmount = promoApplied ? rawTotal - totalPrice : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Фон */}
      <button
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />

      {/* Нижний лист */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-t-3xl shadow-2xl pb-6">
        {/* Хедер */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-100">
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 active:scale-95 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="font-bold text-lg text-slate-900">Адрес и оплата</h2>
          <div className="w-8" />
        </div>

        <div className="px-4 mt-2 space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar pb-2">
          {/* Адрес и контакт */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full border-2 border-red-500" />
              <div className="flex-1 py-1 border-b border-slate-100">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 outline-none"
                  placeholder="Введите адрес доставки"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 py-2 border-b border-slate-100">
              <span className="text-slate-500 text-xl leading-none">💬</span>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
                placeholder="Телефон или комментарий для курьера"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setLeaveAtDoor((v) => !v)}
                className={`flex-1 flex items-center justify-between px-3 py-3 rounded-2xl border ${
                  leaveAtDoor
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex w-8 h-5 rounded-full border transition-colors ${
                      leaveAtDoor ? 'border-transparent bg-[#FDE000]' : 'border-slate-300 bg-white'
                    }`}
                  >
                    <span
                      className={`h-4 w-4 rounded-full bg-white shadow transform transition-transform ${
                        leaveAtDoor ? 'translate-x-3' : 'translate-x-0'
                      }`}
                    />
                  </span>
                  <span className="text-sm">Оставить у двери</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setCallIfMissing((v) => !v)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-2xl ${
                  callIfMissing ? 'bg-[#FDE000]' : 'bg-slate-50 border border-slate-200'
                }`}
              >
                <Phone size={18} className="text-slate-900" />
                <span className="text-sm font-medium text-slate-900">
                  {callIfMissing ? 'Позвонить, если чего-то нет' : 'Не звонить'}
                </span>
              </button>
            </div>
          </div>

          {/* Способы оплаты */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-lg">Способы оплаты</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              <button
                type="button"
                onClick={() => setSelectedPaymentIndex(0)}
                className={`min-w-[140px] px-3 py-3 rounded-2xl flex flex-col justify-between border ${
                  selectedPaymentIndex === 0
                    ? 'bg-white border-2 border-slate-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-7 h-7 rounded-full bg-slate-900" />
                  <span className="text-[10px] font-semibold text-slate-600">MIR</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">· 5828</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedPaymentIndex(1)}
                className={`min-w-[140px] px-3 py-3 rounded-2xl flex flex-col justify-between border ${
                  selectedPaymentIndex === 1
                    ? 'bg-white border-2 border-slate-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard size={16} className="text-slate-700" />
                  <span className="text-xs font-semibold text-slate-800">Я.Карта</span>
                </div>
                <span className="text-xs text-slate-500">Открыть &gt;</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedPaymentIndex(2)}
                className={`min-w-[140px] px-3 py-3 rounded-2xl flex flex-col justify-between border ${
                  selectedPaymentIndex === 2
                    ? 'bg-white border-2 border-slate-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard size={16} className="text-slate-700" />
                  <span className="text-xs font-semibold text-slate-800">MIR · 9039</span>
                </div>
                <span className="text-xs text-slate-500">Добавить</span>
              </button>
            </div>
          </div>

          {/* Чаевые */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-lg">Чаевые курьеру</h3>
            <p className="text-xs text-slate-500">
              Курьер получит всю сумму ваших чаевых
            </p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {['Без чаевых', '3% 48₽', '5% 79₽', '10% 157₽', 'Другое'].map((label, idx) => {
                const isActive = selectedTipIndex === idx;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setSelectedTipIndex(idx)}
                    className={`px-3 py-2 rounded-full text-sm border transition-colors ${
                      isActive
                        ? 'border-slate-900 bg-white font-semibold'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Промокоды */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-lg">Промокоды</h3>
            <div className="w-full h-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
                <Percent size={16} className="text-[#FDE000]" />
              </div>
              <input
                type="text"
                value={promo}
                onChange={(e) => {
                  setPromo(e.target.value.toUpperCase());
                  setPromoApplied(false);
                }}
                className="flex-1 bg-slate-50 rounded-xl px-3 py-2 text-sm font-mono tracking-tight text-slate-900 outline-none border border-slate-200"
                placeholder="Введите промокод"
              />
              <button
                type="button"
                onClick={() => setPromoApplied(promo.trim().length > 0)}
                className="px-3 py-2 text-sm font-semibold text-slate-900 bg-[#FDE000] rounded-xl whitespace-nowrap"
              >
                Применить
              </button>
            </div>
            {promoApplied && (
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Скидка по промокоду</span>
                <span className="text-red-500 font-semibold">
                  −{discountAmount.toFixed(0)}₽
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Нижняя кнопка оплаты */}
        <div className="px-4 pt-2">
          <button
            type="button"
            onClick={onPay}
            className="w-full bg-[#FDE000] active:bg-yellow-400 text-black font-bold py-4 rounded-2xl text-lg shadow-lg shadow-yellow-400/40 transition-all transform active:scale-[0.98]"
          >
            Оплатить {totalPrice.toLocaleString('ru-RU')} ₽
          </button>
          <p className="mt-1 text-center text-xs text-slate-500 line-through">
            {rawTotal.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽
          </p>
        </div>
      </div>
    </div>
  );
};

// 10. OrderSummaryBar (Закрепленный футер с итоговой информацией)
/**
 * @param {{totalPrice: number, selectedMealCount: number, selectedDietPlan: DietPlan, dynamicMacros: {calories: number, protein: number, fat: number, carbs: number}, onPayClick: () => void}} props
 */
const OrderSummaryBar = ({ totalPrice, selectedMealCount, selectedDietPlan, dynamicMacros, onPayClick }) => {
    // Используем динамические макронутриенты из выбранных блюд
    const { calories, protein, fat, carbs } = dynamicMacros;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-blue-50 p-4 pb-8 shadow-[0_-4px_30px_rgba(2,173,255,0.1)] z-50">
            <div className="max-w-md mx-auto w-full">
            {/* Info bar - Динамический КБЖУ */}
            <div className="flex items-center justify-between mb-4 bg-[#F0F9FF] px-4 py-2 rounded-xl border border-blue-100">
                <span className="text-xs font-medium text-slate-600">КБЖУ ({selectedDietPlan.title})</span>
                <span className="text-xs text-slate-500 font-semibold">
                    {calories} ккал · Б {protein} · Ж {fat} · У {carbs}
                </span>
            </div>

            <div className="flex justify-between items-end mb-4 px-2">
                <div>
                    <p className="text-xs text-slate-500 mb-1">Итого к оплате</p>
                    <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900">{totalPrice} ₽</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-slate-400 mb-1">Тариф «{selectedDietPlan.title}»</div>
                    <div className="font-bold text-slate-700 text-sm">{selectedMealCount} блюд / день</div>
                </div>
            </div>

            <button
              onClick={onPayClick}
              className="w-full bg-[#FDE000] active:bg-yellow-400 text-black font-bold py-4 rounded-2xl text-lg shadow-lg shadow-yellow-400/40 transition-all transform active:scale-[0.98]"
            >
                К оплате
            </button>
            </div>
        </div>
    );
}

// --- MAIN APP COMPONENT ---

export default function App() {
  // State for selected DietPlan, Meal Count, and Days
  const [selectedRationId, setSelectedRationId] = useState('normal');
  const [selectedDays, setSelectedDays] = useState(3);
  const allowedDays = [3, 7, 14, 30];
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isThankYouVisible, setIsThankYouVisible] = useState(false);

  /** @type {DietPlan} */
  const selectedDietPlan = useMemo(() => {
    // Находим выбранный план, или используем первый по умолчанию
    return MOCK_DATA.dietPlans.find(p => p.id === selectedRationId) || MOCK_DATA.dietPlans[0];
  }, [selectedRationId]);

  // Инициализируем selectedMealCount минимальным значением для выбранного плана
  const [selectedMealCount, setSelectedMealCount] = useState(() => {
    const plan = MOCK_DATA.dietPlans.find(p => p.id === 'normal') || MOCK_DATA.dietPlans[0];
    return plan.allowedMealCounts[0];
  });

  // Behavior Rule 5.2: Валидация порций при смене рациона
  useEffect(() => {
    // Если текущее количество блюд недоступно в новом плане
    if (!selectedDietPlan.allowedMealCounts.includes(selectedMealCount)) {
      // Устанавливаем минимальное (первое) разрешенное количество блюд для нового рациона
      setSelectedMealCount(selectedDietPlan.allowedMealCounts[0]);
    }
  }, [selectedDietPlan, selectedMealCount]);


  // Filtering and slicing dishes based on selected ration and meal count
  const visibleDishes = useMemo(() => {
    // 1. Фильтруем блюда по выбранному рациону
    const filtered = MOCK_DATA.dishes.filter(d => d.rationIds.includes(selectedRationId));
    // 2. Искусственно ограничиваем количество блюд для прототипа, 
    // чтобы имитировать меню на день (Rule 5.3)
    return filtered.slice(0, selectedMealCount);
  }, [selectedRationId, selectedMealCount]);

  // Filtering tomorrow dishes
  const visibleTomorrowDishes = useMemo(() => {
    const filtered = MOCK_DATA.tomorrowDishes.filter(d => d.rationIds.includes(selectedRationId));
    return filtered.slice(0, selectedMealCount);
  }, [selectedRationId, selectedMealCount]);

  // Calculating dynamic macros from selected dishes (rounded to nearest hundred)
  const dynamicMacros = useMemo(() => {
    // 1. Считаем сумму реальных блюд
    const macros = visibleDishes.reduce(
      (acc, dish) => ({
        calories: acc.calories + dish.calories,
        protein: acc.protein + dish.protein,
        fat: acc.fat + dish.fat,
        carbs: acc.carbs + dish.carbs
      }),
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );

    // 2. Экстраполяция: если блюд меньше, чем выбрано (есть заглушки "Еще готовим"),
    // масштабируем сумму пропорционально
    if (visibleDishes.length > 0 && visibleDishes.length < selectedMealCount) {
      const multiplier = selectedMealCount / visibleDishes.length;
      
      macros.calories *= multiplier;
      macros.protein *= multiplier;
      macros.fat *= multiplier;
      macros.carbs *= multiplier;
    }

    // Округляем все значения до ближайшей сотни
    return {
      calories: roundToHundred(macros.calories),
      protein: roundToHundred(macros.protein),
      fat: roundToHundred(macros.fat),
      carbs: roundToHundred(macros.carbs)
    };
  }, [visibleDishes, selectedMealCount]);


  // Calculating total price with days
  const totalPrice = useMemo(() => {
    // Формула: 100 + 250*количество_блюд*количество_дней + (количество_дней//3)*50
    const basePrice = 100;
    const mealsPrice = 250 * selectedMealCount * selectedDays;
    const deliveryPrice = Math.floor(selectedDays / 3) * 50;
    const total = basePrice + mealsPrice + deliveryPrice;
    return roundToHundred(total);
  }, [selectedMealCount, selectedDays]);

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    // Main layout container: Centered and responsive (max-w-md is mobile-first approach)
    <div className="bg-[#F0F9FF] min-h-screen font-sans pb-44 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      <TopNavBar />
      
      <div className="overflow-auto h-full">
        <QuickActionsBar onScrollTo={scrollToSection} />
        <RationPromoBanner />

        {/* 4. DietPlanSelector */}
        <DietPlanSelector 
          selectedId={selectedRationId} 
          onSelect={setSelectedRationId}
          dynamicCalories={dynamicMacros.calories}
        />

        {/* 5. PortionSizePicker - Динамический выбор порций */}
        <PortionSizePicker
          currentCount={selectedMealCount}
          allowedCounts={selectedDietPlan.allowedMealCounts}
          onSelect={setSelectedMealCount}
        />

        {/* 5.5. DaysPicker - Выбор количества дней */}
        <DaysPicker
          currentDays={selectedDays}
          allowedDays={allowedDays}
          onSelect={setSelectedDays}
        />

        <div className="px-4">
          {/* DailyMenuGrid (Контейнер) */}
          <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">Меню на сегодня</h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {visibleDishes.map(dish => (
              <MealCard key={dish.id} dish={dish} />
            ))}
             {/* Заглушки, чтобы количество карточек совпадало с выбранным числом блюд */}
             {visibleDishes.length < selectedMealCount &&
               Array.from({ length: selectedMealCount - visibleDishes.length }).map((_, idx) => (
                 <div
                   key={`placeholder-today-${idx}`}
                   className="bg-white/50 border-2 border-dashed border-blue-200 rounded-[24px] flex flex-col items-center justify-center p-4 text-blue-300 text-center text-xs h-full min-h-[200px]"
                 >
                   <div className="mb-2 text-2xl">🧑‍🍳</div>
                   Еще готовим...
                 </div>
               ))
             }
          </div>

          {/* Tomorrow Menu */}
          <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">Меню на завтра</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {visibleTomorrowDishes.map(dish => (
              <MealCard key={dish.id} dish={dish} />
            ))}
             {/* Заглушки, чтобы количество карточек совпадало с выбранным числом блюд */}
             {visibleTomorrowDishes.length < selectedMealCount &&
               Array.from({ length: selectedMealCount - visibleTomorrowDishes.length }).map((_, idx) => (
                 <div
                   key={`placeholder-tomorrow-${idx}`}
                   className="bg-white/50 border-2 border-dashed border-blue-200 rounded-[24px] flex flex-col items-center justify-center p-4 text-blue-300 text-center text-xs h-full min-h-[200px]"
                 >
                   <div className="mb-2 text-2xl">🧑‍🍳</div>
                   Еще готовим...
                 </div>
               ))
             }
          </div>
        </div>

        {/* Зона доставки - всегда видна */}
        <DeliveryZoneSection />

        {/* FAQ - свернутый по умолчанию */}
        <FAQSection />
      </div>

      {/* 10. OrderSummaryBar - Итоговая панель с динамическим КБЖУ (Rule 5.1) */}
      <OrderSummaryBar 
        totalPrice={totalPrice} 
        selectedMealCount={selectedMealCount}
        selectedDietPlan={selectedDietPlan}
        dynamicMacros={dynamicMacros}
        onPayClick={() => setIsPaymentOpen(true)}
      />

      {/* 9. PaymentSheet - нижний экран "Адрес и оплата" */}
      {isPaymentOpen && (
        <PaymentSheet
          totalPrice={totalPrice}
          selectedMealCount={selectedMealCount}
          selectedDays={selectedDays}
          onClose={() => setIsPaymentOpen(false)}
          onPay={() => {
            setIsPaymentOpen(false);
            setIsThankYouVisible(true);
          }}
        />
      )}

      {/* Экран благодарности */}
      {isThankYouVisible && (
        <button
          type="button"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 text-white text-sm"
          onClick={() => setIsThankYouVisible(false)}
        >
          Спасибо!
        </button>
      )}
    </div>
  );
}
