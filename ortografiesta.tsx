"use client"
import { useEffect, useState } from "react"
import { Star, Music, Volume2, VolumeX, Pause } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAudio } from './app/contexts/AudioContext'

export default function Ortografiesta() {
  const router = useRouter();
  const {
    isMusicPlaying,
    isMuted,
    toggleMusic,
    toggleMute,
    attemptAutoplay,
    enableAudio
  } = useAudio();

  const [showMusicPrompt, setShowMusicPrompt] = useState(true)
  const [showAvatarSelector, setShowAvatarSelector] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState<string>('🐱');
  const [showWelcome, setShowWelcome] = useState(
    () => !localStorage.getItem('ortografia-welcome-shown')
  );


  useEffect(() => {
    const saved = localStorage.getItem('ortografia-avatar')
    if (saved) {
      setSelectedAvatar(saved)
      setShowAvatarSelector(false)
    } else {
      setShowAvatarSelector(true)
    }
  }, [])

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
    @keyframes wiggle {
      0%,100% { transform: rotate(-3deg) }
      50%    { transform: rotate(3deg) }
    }
    .animate-wiggle { animation: wiggle 3s ease-in-out infinite }
    @keyframes pop-in {
      from { opacity: 0; transform: scale(0.5) }
      to   { opacity: 1; transform: scale(1) }
    }
    .animate-pop-in { animation: pop-in 0.5s ease-out forwards }
  `;
    document.head.appendChild(style);

    let interactionListener: any;

    if (!showWelcome) {
      const saved = localStorage.getItem('ortografia-avatar');
      if (saved) {
        interactionListener = (e: Event) => {
          // Solo activar audio si no está ya reproduciéndose
          if (!isMusicPlaying) {
            attemptAutoplay().then(() => {
              setShowMusicPrompt(false);
              if (!isMusicPlaying) toggleMusic();
            });
          }
        };

        // Agregar listeners con { once: true } para que solo se ejecuten una vez
        document.addEventListener('click', interactionListener, { once: true });
        document.addEventListener('touchstart', interactionListener, { once: true });
        document.addEventListener('keydown', interactionListener, { once: true });
      }
    }

    return () => {
      document.head.removeChild(style);
      // Limpiar listeners específicamente
      if (interactionListener) {
        document.removeEventListener('click', interactionListener);
        document.removeEventListener('touchstart', interactionListener);
        document.removeEventListener('keydown', interactionListener);
      }
    };
  }, [attemptAutoplay, showWelcome, isMusicPlaying]); // Añadimos isMusicPlaying
  const handleStart = () => {
    localStorage.setItem('ortografia-avatar', selectedAvatar);
    localStorage.setItem('ortografia-welcome-shown', 'true'); // Nuevo flag
    setShowWelcome(false);
    setShowAvatarSelector(false);
    enableAudio();
    attemptAutoplay().then(() => {
      setShowMusicPrompt(false);
      toggleMusic();
    });
  };

  useEffect(() => {
  const handleBeforeUnload = () => {
    localStorage.removeItem('ortografia-welcome-shown');
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, []);


  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleMute()
  }

  useEffect(() => {
    const animate = () => {
      document.documentElement.style.setProperty(
        '--hue', `${(Date.now() / 50) % 360}deg`
      );
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const navegarAUnidad = (unidad: number) => {
    if (unidad === 1) {
      router.push("/unidad_1")
    } else {
      alert("Esta unidad estará disponible próximamente")
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-300 to-yellow-200 overflow-hidden relative">
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="mb-12 text-center relative">
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <button
              onClick={() => setShowAvatarSelector(true)}
              className="cursor-pointer text-4xl bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
              title="Cambiar avatar"
            >
              {selectedAvatar}
            </button>
          </div>
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
        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 mb-12" onClick={() => navegarAUnidad(1)}>
          <button
            className="btn bg-gradient-to-b from-orange-400 to-orange-500 text-white text-xl md:text-2xl font-bold py-4 px-8 rounded-full shadow-lg transition-all hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/0 via-yellow-300/30 to-yellow-300/0 group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            <span className="relative flex items-center">
              JUGAR
              <span className="ml-2 text-2xl">🎮</span>
            </span>
          </button >
          <button className="btn bg-gradient-to-b from-teal-400 to-teal-500 text-white text-xl md:text-2xl font-bold py-4 px-8 rounded-full shadow-lg transition-all hover:shadow-xl active:scale-95 relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-200/0 via-teal-200/30 to-teal-200/0 group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            <span className="relative flex items-center">
              MI PROGRESO
              <span className="ml-2 text-2xl">📊</span>
            </span>
          </button>
        </div>

        {/* Sound controls - more visible now */}
        <div className="audio-controls absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleToggleMute}
            className="p-3 bg-white/90 rounded-full hover:bg-white transition shadow-md cursor-pointer"
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-6 h-6 text-purple-600" /> : <Volume2 className="w-6 h-6 text-purple-600" />}
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

      {showAvatarSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl text-center max-w-md animate-pop-in">
            <h2 className="text-3xl font-bold mb-4 text-purple-600">¡Elige tu avatar!</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {['🐱', '🐶', '🦊', '🐻', '🐨', '🐵'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedAvatar(emoji)}
                  className={`text-5xl p-4 rounded-2xl transition-all cursor-pointer ${selectedAvatar === emoji
                    ? 'bg-yellow-400 scale-110'
                    : 'bg-gray-100 hover:bg-yellow-200'
                    }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                localStorage.setItem('ortografia-avatar', selectedAvatar);
                setShowAvatarSelector(false);
                enableAudio();
                setShowMusicPrompt(false);
                handleStart
              }}
              className="cursor-pointer bg-green-500 text-white px-6 py-3 rounded-full text-xl font-bold hover:bg-green-600 transition-colors cursor-pointer"
            >
              Seleccionar
            </button>
          </div>
        </div>
      )}


      {showWelcome && (
        <div className="fixed inset-0 bg-[black]/90 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="relative bg-gradient-to-br from-yellow-300 via-blue-300 to-pink-300 p-2 rounded-[40px] text-center max-w-2xl animate-pop-in shadow-2xl border-4 border-white">
            <div className="bg-white p-8 rounded-[32px] relative overflow-hidden">

              {/* Elementos decorativos */}
              <div className="absolute -top-16 left-0 right-0 flex justify-center gap-8">
                <div className="animate-bounce text-6xl">🎈</div>
                <div className="animate-bounce text-6xl delay-150">🎉</div>
                <div className="animate-bounce text-6xl delay-300">🎁</div>
              </div>

              <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-yellow-200 rounded-full opacity-30"></div>

              {/* Contenido principal */}
              <div className="relative z-10">
                <h1 className="text-6xl font-bold mb-12 font-comic bg-gradient-to-r from-purple-600 to-red-500  bg-clip-text text-transparent">
                  ¡Hola Amiguito/a!
                </h1>

                <div className="mb-8 space-y-4 text-xl">
                  <div className="flex items-center gap-3 bg-blue-100 p-3  justify-center rounded-2xl animate-bounce">
                    <span className="text-4xl">🧩</span>
                    <p className="font-bold text-blue-800">Aprende ortografía<br /><span className="text-2xl">jugando divertidos juegos</span></p>
                  </div>

                  <div className="flex items-center gap-3 bg-yellow-100 p-3 justify-center rounded-2xl animate-bounce delay-100">
                    <span className="text-4xl">🦸</span>
                    <p className="font-bold text-yellow-800">Conviértete en<br /><span className="text-2xl">un súper héroe de las letras</span></p>
                  </div>

                  <div className="flex items-center gap-3 bg-green-100 p-3 justify-center rounded-2xl animate-bounce delay-100">
                    <span className="text-4xl">🏅</span>
                    <p className="font-bold text-green-800">Gana premios y<br /><span className="text-2xl">diviértete aprendiendo</span></p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleStart();
                    if (!isMusicPlaying) {
                      toggleMusic();
                    }
                  }}
                  className="cursor-pointer  bg-gradient-to-r from-green-400 to-blue-400 text-white text-3xl px-10 py-5 rounded-2xl font-bold hover:scale-105 transition-transform duration-300 shadow-xl hover:shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  <span className="flex items-center gap-3 relative">
                    ¡Jugar y Aprender!
                  </span>
                </button>
              </div>

              {/* Animalitos decorativos */}
              <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-[url('https://i.pinimg.com/originals/49/72/29/4972294b4a86b965a9f8df97371d5c3f.png')] bg-contain bg-no-repeat opacity-80 animate-float"></div>
              <div className="absolute -right-20 -top-20 w-40 h-40 bg-[url('https://www.pngmart.com/files/15/Cute-Raccoon-PNG-Transparent-Image.png')] bg-contain bg-no-repeat opacity-80 animate-float-delayed"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


