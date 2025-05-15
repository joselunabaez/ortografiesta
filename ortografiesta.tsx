"use client"
import { useEffect, useRef, useState } from "react"
import { Star, Music, Volume2, VolumeX, Pause } from "lucide-react"
import { useRouter } from "next/navigation"
export default function Ortografiesta() {
  const router = useRouter();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [showMusicPrompt, setShowMusicPrompt] = useState(true);
  
  useEffect(() => {
    // Create style for wiggle animation
    const style = document.createElement("style");
    style.textContent = `
    @keyframes wiggle {
      0%, 100% { transform: rotate(-3deg); }
      50% { transform: rotate(3deg); }
    }
    .animate-wiggle {
      animation: wiggle 3s ease-in-out infinite;
    }
    `;
    document.head.appendChild(style);

    const audio = new Audio('/sounds/infantil.m4a'); // Make sure this path is correct
    audio.loop = true;
    audio.volume = 0.5;
    setAudioRef(audio);
    
    const enableAudio = () => {
      if (audio) {
        if (audio.paused) {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsMusicPlaying(true);
                setShowMusicPrompt(false);
              })
              .catch(error => {
                console.log("Play failed:", error);
                setIsMusicPlaying(false);
              });
          }
        }
      }
      
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
      document.removeEventListener('keydown', enableAudio);
    };

    // Add event listeners for user interaction
    document.addEventListener('click', enableAudio);
    document.addEventListener('touchstart', enableAudio);
    document.addEventListener('keydown', enableAudio);
    
    // Try autoplay anyway (might work in some browsers/situations)
    const attemptAutoplay = async () => {
      try {
        audio.muted = true;
        await audio.play();
        setTimeout(() => {
          audio.muted = false;
          setIsMusicPlaying(true);
          setShowMusicPrompt(false);
        }, 100);
      } catch (err) {
        console.log("Autoplay attempt failed:", err);
        audio.muted = false;
      }
    };
    
    attemptAutoplay();
    
    return () => {
      document.head.removeChild(style);
      if (audio) {
        audio.pause();
        audio.src = "";
      }
      // Clean up event listeners
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
      document.removeEventListener('keydown', enableAudio);
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef) {
      if (isMusicPlaying) {
        audioRef.pause();
      } else {
        const playPromise = audioRef.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
            })
            .catch(error => {
              console.log("Play failed:", error);
            });
        }
      }
      setIsMusicPlaying(!isMusicPlaying);
      setShowMusicPrompt(false);
    }
  };

  const toggleMute = () => {
    if (audioRef) {
      audioRef.muted = !audioRef.muted;
      setIsMuted(!isMuted);
    }
  };

  const navegarAUnidad = (unidad: number) => {
    if (unidad === 1) {
      router.push("/unidad_1")
    } else {
      // Para futuras unidades
      alert("Esta unidad estará disponible próximamente")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-300 to-yellow-200 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${i % 3 === 0 ? "bg-purple-500" : i % 3 === 1 ? "bg-teal-400" : "bg-orange-400"
              }`}
            style={{
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.6,
              animation: `float ${Math.random() * 5 + 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Clouds */}
      <div
        className="absolute top-20 left-10 w-32 h-16 bg-white rounded-full opacity-80 animate-pulse"
        style={{ animationDuration: "8s" }}
      />
      <div
        className="absolute top-40 right-20 w-40 h-20 bg-white rounded-full opacity-80 animate-pulse"
        style={{ animationDuration: "10s" }}
      />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="mb-12 text-center relative">
          <div className="inline-block relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-3xl opacity-75 blur-xl animate-pulse"></div>
            <h1 className="text-5xl md:text-6xl font-bold text-white bg-red-500 px-8 py-4 rounded-3xl shadow-lg inline-block relative">
              <span className="text-yellow-400 inline-block">Ortogra</span>
              <span className="text-green-300 inline-block">fiesta</span>
              <Star
                className="absolute -top-4 -right-4 w-10 h-10 text-yellow-300 animate-spin"
                style={{ animationDuration: "10s" }}
              />
            </h1>
          </div>
        </header>

        {/* Botones */}
        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 mb-12">
          <button
            className="btn bg-gradient-to-b from-orange-400 to-orange-500 text-white text-xl md:text-2xl font-bold py-4 px-8 rounded-full shadow-lg transition-all hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/0 via-yellow-300/30 to-yellow-300/0 group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            <span className="relative flex items-center">
              JUGAR
              <span className="ml-2 text-2xl">🎮</span>
            </span>
          </button>
          <button className="btn bg-gradient-to-b from-teal-400 to-teal-500 text-white text-xl md:text-2xl font-bold py-4 px-8 rounded-full shadow-lg transition-all hover:shadow-xl active:scale-95 relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-200/0 via-teal-200/30 to-teal-200/0 group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            <span className="relative flex items-center">
              MI PROGRESO
              <span className="ml-2 text-2xl">📊</span>
            </span>
          </button>
        </div>

         {/* Sound controls - more visible now */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={toggleMusic}
            className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-md"
            title={isMusicPlaying ? "Pausar música" : "Iniciar música"}
          >
            {isMusicPlaying ? (
              <Music className="w-6 h-6 text-purple-600" />
            ) : (
              <Pause className="w-6 h-6 text-purple-600" />
            )}
          </button>
          <button
            onClick={toggleMute}
            className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-md"
            title={isMuted ? "Activar sonido" : "Silenciar"}
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6 text-purple-600" />
            ) : (
              <Volume2 className="w-6 h-6 text-purple-600" />
            )}
          </button>
        </div>
        {/* Units */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { title: "Sonidos y Letras", color: "bg-teal-400", icon: "🔤", emoji: "🎵", unidad: 1 },
            { title: "Uso de Mayúsculas", color: "bg-red-600", icon: "🔠", emoji: "👑", unidad: 2 },
            { title: "Reglas de Acentuación", color: "bg-orange-400", icon: "✏️", emoji: "⭐", unidad: 3 },
            { title: "Palabras Homófonas", color: "bg-green-400", icon: "🎭", emoji: "🎪", unidad: 4 },
            { title: "Reglas Ortográficas", color: "bg-blue-400", icon: "📝", emoji: "📚", unidad: 5 },
            { title: "Prácticas Creativas", color: "bg-purple-600", icon: "🎨", emoji: "👨‍🎨", unidad: 6 },
          ].map((unit, index) => (
            <div
              key={index}
              className={`
                ${unit.color} rounded-3xl p-4 shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden group`
              }
              onClick={() => navegarAUnidad(unit.unidad)}
            >
              {/* Fondo con burbujas */}
              <div className="absolute inset-0 opacity-10">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-white"
                    style={{
                      width: `${Math.random() * 30 + 10}px`,
                      height: `${Math.random() * 30 + 10}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                  />
                ))}
              </div>

              {/* Efecto de brillo en el borde */}
              <div className="absolute inset-0 rounded-3xl border-4 border-white/0 group-hover:border-white/30 transition-all duration-300"></div>

              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-24 h-24 flex items-center justify-center mb-3 bg-white/30 rounded-full group-hover:bg-white/40 transition-all duration-300 relative">
                  <span className="text-5xl">{unit.icon}</span>
                  <span className="absolute -top-2 -right-2 text-2xl animate-bounce">{unit.emoji}</span>
                </div>
                <h3 className="text-white font-bold text-xl mb-1 group-hover:scale-105 transition-transform duration-300">
                  Unidad {index + 1}
                </h3>
                <p className="text-white font-semibold">{unit.title}</p>

                {/* Indicador de progreso */}
                <div className="mt-3 w-full bg-white/30 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-yellow-300 h-3 rounded-full transition-all duration-1000 ease-in-out"
                    style={{ width: "0%" }}
                  ></div>
                </div>

                {/* Estrellas */}
                <div className="flex mt-2 gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-white/50 group-hover:scale-110 transition-transform duration-300"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Elementos flotantes adicionales */}
      <div className="absolute bottom-10 left-10 hidden lg:block">
        <div className="relative w-20 h-20">
          <div
            className="absolute w-16 h-16 bg-yellow-300 rounded-full animate-bounce opacity-80"
            style={{ animationDuration: "4s" }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-3xl">📚</div>
          </div>
        </div>
      </div>

      <div className="absolute top-40 left-10 hidden lg:block">
        <div className="relative w-16 h-16">
          <div
            className="absolute w-14 h-14 bg-purple-300 rounded-full animate-pulse opacity-80"
            style={{ animationDuration: "5s" }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-3xl">✏️</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-20 right-20 hidden lg:block">
        <div className="relative w-20 h-20">
          <div
            className="absolute w-16 h-16 bg-teal-300 rounded-full animate-bounce opacity-80"
            style={{ animationDuration: "3.5s" }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-3xl">🎯</div>
          </div>
        </div>
      </div>
    </div>
  )
}
