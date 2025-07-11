
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    welcome: 'Welcome to STEMSphere',
    connect: 'Connect with scientists, researchers, and STEM enthusiasts worldwide',
    home: 'Home',
    explore: 'Explore',
    categories: 'Categories',
    messages: 'Messages',
    profile: 'Profile',
    post: 'Post',
    like: 'Like',
    comment: 'Comment',
    follow: 'Follow',
    following: 'Following',
    followers: 'Followers',
    notifications: 'Notifications',
    settings: 'Settings',
    language: 'Language',
    signOut: 'Sign Out',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    whatsHappening: "What's happening in STEM?",
    trendingTopics: 'Trending Topics',
    suggestedScientists: 'Suggested Scientists',
    featuredScientists: 'Featured Scientists',
    stemCategories: 'STEM Categories',
    loadMore: 'Load more posts',
    posts: 'posts',
    discussions: 'discussions'
  },
  es: {
    welcome: 'Bienvenido a STEMSphere',
    connect: 'Conecta con científicos, investigadores y entusiastas STEM de todo el mundo',
    home: 'Inicio',
    explore: 'Explorar',
    categories: 'Categorías',
    messages: 'Mensajes',
    profile: 'Perfil',
    post: 'Publicar',
    like: 'Me gusta',
    comment: 'Comentar',
    follow: 'Seguir',
    following: 'Siguiendo',
    followers: 'Seguidores',
    notifications: 'Notificaciones',
    settings: 'Configuración',
    language: 'Idioma',
    signOut: 'Cerrar sesión',
    signIn: 'Iniciar sesión',
    signUp: 'Registrarse',
    whatsHappening: '¿Qué está pasando en STEM?',
    trendingTopics: 'Temas en tendencia',
    suggestedScientists: 'Científicos sugeridos',
    featuredScientists: 'Científicos destacados',
    stemCategories: 'Categorías STEM',
    loadMore: 'Cargar más publicaciones',
    posts: 'publicaciones',
    discussions: 'discusiones'
  },
  fr: {
    welcome: 'Bienvenue sur STEMSphere',
    connect: 'Connectez-vous avec des scientifiques, chercheurs et passionnés STEM du monde entier',
    home: 'Accueil',
    explore: 'Explorer',
    categories: 'Catégories',
    messages: 'Messages',
    profile: 'Profil',
    post: 'Publier',
    like: 'J\'aime',
    comment: 'Commenter',
    follow: 'Suivre',
    following: 'Abonnements',
    followers: 'Abonnés',
    notifications: 'Notifications',
    settings: 'Paramètres',
    language: 'Langue',
    signOut: 'Se déconnecter',
    signIn: 'Se connecter',
    signUp: 'S\'inscrire',
    whatsHappening: 'Que se passe-t-il en STEM?',
    trendingTopics: 'Sujets tendance',
    suggestedScientists: 'Scientifiques suggérés',
    featuredScientists: 'Scientifiques en vedette',
    stemCategories: 'Catégories STEM',
    loadMore: 'Charger plus de publications',
    posts: 'publications',
    discussions: 'discussions'
  },
  de: {
    welcome: 'Willkommen bei STEMSphere',
    connect: 'Verbinden Sie sich mit Wissenschaftlern, Forschern und STEM-Enthusiasten weltweit',
    home: 'Startseite',
    explore: 'Erkunden',
    categories: 'Kategorien',
    messages: 'Nachrichten',
    profile: 'Profil',
    post: 'Posten',
    like: 'Gefällt mir',
    comment: 'Kommentieren',
    follow: 'Folgen',
    following: 'Folge ich',
    followers: 'Follower',
    notifications: 'Benachrichtigungen',
    settings: 'Einstellungen',
    language: 'Sprache',
    signOut: 'Abmelden',
    signIn: 'Anmelden',
    signUp: 'Registrieren',
    whatsHappening: 'Was passiert in STEM?',
    trendingTopics: 'Trending Topics',
    suggestedScientists: 'Vorgeschlagene Wissenschaftler',
    featuredScientists: 'Empfohlene Wissenschaftler',
    stemCategories: 'STEM-Kategorien',
    loadMore: 'Mehr Beiträge laden',
    posts: 'Beiträge',
    discussions: 'Diskussionen'
  },
  ru: {
    welcome: 'Добро пожаловать в STEMSphere',
    connect: 'Общайтесь с учёными, исследователями и энтузиастами STEM по всему миру',
    home: 'Главная',
    explore: 'Исследовать',
    categories: 'Категории',
    messages: 'Сообщения',
    profile: 'Профиль',
    post: 'Опубликовать',
    like: 'Нравится',
    comment: 'Комментировать',
    follow: 'Подписаться',
    following: 'Подписки',
    followers: 'Подписчики',
    notifications: 'Уведомления',
    settings: 'Настройки',
    language: 'Язык',
    signOut: 'Выйти',
    signIn: 'Войти',
    signUp: 'Регистрация',
    whatsHappening: 'Что происходит в STEM?',
    trendingTopics: 'Популярные темы',
    suggestedScientists: 'Рекомендуемые учёные',
    featuredScientists: 'Рекомендуемые учёные',
    stemCategories: 'STEM категории',
    loadMore: 'Загрузить больше постов',
    posts: 'постов',
    discussions: 'обсуждений'
  }
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
