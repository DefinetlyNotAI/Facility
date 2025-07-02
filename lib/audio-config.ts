// Centralized audio configuration for the entire application
// All audio file paths are defined here for easy management and consistency

// Background Music
export const BACKGROUND_AUDIO = {
  HOME: "/sfx/home/sweethome.mp3",
  BNW: "/sfx/music/thethirdcry.mp3",
  BUTTONS: "/sfx/music/hopeformehopeforyou.mp3",
  CHOICES: "/sfx/choices/retrospect.mp3",
  TERMINAL: "/sfx/music/thethirdcry.mp3",
  WIFI_PANEL: "/sfx/music/isitreallyfine.mp3",
  WIFI_LOGIN: "/sfx/home/sweethome.mp3",
  MEDIA: "/sfx/music/isitreallyfine.mp3",
  SCROLL: "/sfx/scroll/nowhereissafesowillyouscroll.mp3",
  SCROLL_ESCAPE: "/sfx/scroll/█.mp3",
  H0M3: "/sfx/all/clockat3.mp3",
  CHEATER: "/sfx/music/doangelsexist.mp3",
  ROOT_PAGE: "/sfx/music/doangelsexist.mp3",
  THE_END_QUESTION: "/sfx/isittheend/thesunwontshine.mp3",
  THE_END_FINAL: "/sfx/isittheend/NeverendingNight_DELTARUNE_Chapter_3-4_Soundtrack_Toby_Fox.mp3",
  MOONLIGHT_NORMAL: "/sfx/moon/contemplation.mp3",
  MOONLIGHT_RED: "/sfx/moon/doestimeexist.mp3",
  MOONLIGHT_STATIC: "/sfx/all/static.mp3",
  FOUR_OH_FOUR: "/sfx/all/clockat3.mp3"
} as const;

// Sound Effects
export const SFX_AUDIO = {
  SUCCESS: "/sfx/all/computeryay.mp3",
  ERROR: "/sfx/all/computerboo.mp3",
  ALERT: "/sfx/all/alert.mp3",
  STATIC: "/sfx/all/static.mp3",
  HORROR: "/sfx/all/horror.mp3",
  HEARTBEAT: "/sfx/all/heartbeat.mp3",
  FILE_DELETE: "/sfx/all/file_delete.m4a",
  CENSORSHIP: "/sfx/all/censorship.mp3",
  EGG_CRACK: "/sfx/all/eggcrack.mp3",
  CRY: "/sfx/all/cry.mp3",
  BABY_CRY: "/sfx/all/babycry.mp3"
} as const;

// Media Files
export const MEDIA_AUDIO = {
  MORSE_CODE: "/media/morse.wav"
} as const;

// Utility function to play audio with error handling
export const playAudio = (audioPath: string, options: {
  volume?: number;
  loop?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
} = {}) => {
  try {
    const audio = new Audio(audioPath);
    audio.volume = options.volume ?? 0.6;
    audio.loop = options.loop ?? false;
    
    audio.play()
      .then(() => options.onSuccess?.())
      .catch((error) => {
        console.warn(`Failed to play audio: ${audioPath}`, error);
        options.onError?.(error);
      });
    
    return audio;
  } catch (error) {
    console.warn(`Failed to create audio: ${audioPath}`, error);
    options.onError?.(error as Error);
    return null;
  }
};

// Utility function to initialize background audio with user interaction handling
export const initializeBackgroundAudio = (
  audioRef: React.RefObject<HTMLAudioElement>,
  audioPath: string,
  options: {
    volume?: number;
    autoPlay?: boolean;
  } = {}
) => {
  const { volume = 0.3, autoPlay = true } = options;
  
  const initializeAudio = () => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (autoPlay) {
        audioRef.current.play().catch(() => {
          // Auto-play failed, will try again on user interaction
          const handleInteraction = () => {
            if (audioRef.current) {
              audioRef.current.play().catch(console.warn);
            }
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('keydown', handleInteraction);
          };
          document.addEventListener('click', handleInteraction);
          document.addEventListener('keydown', handleInteraction);
        });
      }
    }
  };

  return initializeAudio;
};

// Utility function to cleanup audio
export const cleanupAudio = (audioRef: React.RefObject<HTMLAudioElement>) => {
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }
};