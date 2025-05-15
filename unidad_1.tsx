"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Star, ArrowLeft, Volume2, Check, X, HelpCircle, Award, Mic } from "lucide-react"
import confetti from "canvas-confetti"
import { useRouter } from "next/navigation"

// Datos para las actividades
const letrasConfusasData = [
  {
    grupo: "b/v",
    descripcion: "Aunque suenan igual, se escriben diferente según su origen y reglas ortográficas.",
    ejemplos: [
      {
        palabra: "barco",
        letra: "b",
        explicacion: "Se escribe con B las palabras que empiezan por 'bu-', 'bur-', 'bus-'",
      },
      { palabra: "viento", letra: "v", explicacion: "Se escribe con V las palabras que empiezan por 'vi-'" },
      { palabra: "biblioteca", letra: "b", explicacion: "Se escribe con B después de 'm'" },
      { palabra: "invierno", letra: "v", explicacion: "Se escribe con V después de 'n'" },
    ],
  },
  {
    grupo: "c/s/z",
    descripcion: "Estas letras pueden representar sonidos similares dependiendo del dialecto y la posición.",
    ejemplos: [
      { palabra: "cielo", letra: "c", explicacion: "La C suena como S antes de E o I" },
      { palabra: "zapato", letra: "z", explicacion: "La Z se usa principalmente antes de A, O, U" },
      { palabra: "sol", letra: "s", explicacion: "La S mantiene siempre el mismo sonido" },
      { palabra: "cebra", letra: "c", explicacion: "La C suena como Z antes de E en algunos dialectos" },
    ],
  },
  {
    grupo: "g/j",
    descripcion: "Estas letras pueden tener sonidos similares dependiendo de las vocales que las siguen.",
    ejemplos: [
      { palabra: "girasol", letra: "g", explicacion: "La G suena como J antes de E o I" },
      { palabra: "jamón", letra: "j", explicacion: "La J mantiene siempre el mismo sonido" },
      { palabra: "gato", letra: "g", explicacion: "La G tiene un sonido suave antes de A, O, U" },
      { palabra: "jirafa", letra: "j", explicacion: "Se escribe con J las palabras que terminan en '-aje'" },
    ],
  },
]

// Palabras para completar
const palabrasCompletar = [
  { palabra: "_arco", opciones: ["b", "v"], correcta: "b", pista: "Embarcación para navegar" },
  { palabra: "_aca", opciones: ["b", "v"], correcta: "v", pista: "Animal que da leche" },
  { palabra: "_apato", opciones: ["z", "s"], correcta: "z", pista: "Calzado para los pies" },
  { palabra: "_iudad", opciones: ["c", "s"], correcta: "c", pista: "Población grande" },
  { palabra: "_irafa", opciones: ["g", "j"], correcta: "j", pista: "Animal de cuello largo" },
  { palabra: "_ente", opciones: ["g", "j"], correcta: "g", pista: "Personas" },
  { palabra: "bi_icleta", opciones: ["c", "s"], correcta: "c", pista: "Vehículo de dos ruedas" },
  { palabra: "ca_eza", opciones: ["b", "v"], correcta: "b", pista: "Parte superior del cuerpo" },
  { palabra: "lápi_", opciones: ["z", "s"], correcta: "z", pista: "Instrumento para escribir" },
  { palabra: "pá_aro", opciones: ["g", "j"], correcta: "j", pista: "Animal que vuela" },
]

// Palabras para dictado
const palabrasDictado = [
  "barco",
  "vaca",
  "zapato",
  "ciudad",
  "jirafa",
  "gente",
  "bicicleta",
  "cabeza",
  "lápiz",
  "pájaro",
  "biblioteca",
  "ventana",
  "cebra",
  "sol",
  "girasol",
]

// Palabras para sopa de letras
const palabrasSopa = ["BARCO", "VACA", "ZAPATO", "CIUDAD", "JIRAFA", "GENTE", "BICICLETA", "CABEZA", "LAPIZ", "PAJARO"]

// Tipos de actividades
type Actividad = "diferencias" | "completar" | "dictado" | "sopa"

export default function Unidad1() {
  const router = useRouter()
  const [actividad, setActividad] = useState<Actividad>("diferencias")
  const [grupoActual, setGrupoActual] = useState(0)
  const [preguntaActual, setPreguntaActual] = useState(0)
  const [respuestas, setRespuestas] = useState<boolean[]>([])
  const [mostrarResultado, setMostrarResultado] = useState<boolean | null>(null)
  const [puntuacion, setPuntuacion] = useState(0)
  const [actividadCompletada, setActividadCompletada] = useState(false)
  const [palabraDictado, setPalabraDictado] = useState("")
  const [respuestaDictado, setRespuestaDictado] = useState("")
  const [sopaLetras, setSopaLetras] = useState<string[][]>([])
  const [palabrasEncontradas, setPalabrasEncontradas] = useState<string[]>([])
  const [seleccionInicio, setSeleccionInicio] = useState<{ row: number; col: number } | null>(null)
  const [seleccionActual, setSeleccionActual] = useState<{ row: number; col: number } | null>(null)
  const [palabrasSeleccionadas, setPalabrasSeleccionadas] = useState<
    { palabra: string; celdas: { row: number; col: number }[] }[]
  >([])
  const sopaRef = useRef<HTMLDivElement>(null)

  // Mantener los elementos decorativos consistentes
  const [elementosDecorativosPos, setElementosDecorativosPos] = useState<
    { top: string; left: string; size: string; color: string }[]
  >([])

  // Generar posiciones aleatorias para elementos decorativos una sola vez
  useEffect(() => {
    if (elementosDecorativosPos.length === 0) {
      const elementos = Array(20)
        .fill(0)
        .map(() => {
          const colors = ["bg-purple-500", "bg-teal-400", "bg-orange-400"]
          return {
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: `${Math.random() * 20 + 10}px`,
            color: colors[Math.floor(Math.random() * colors.length)],
          }
        })
      setElementosDecorativosPos(elementos)
    }
  }, [elementosDecorativosPos])

  // Función para reproducir sonido de palabra
  const reproducirSonido = (palabra: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(palabra)
      utterance.lang = "es-ES"
      speechSynthesis.speak(utterance)
    }
  }

  // Función para verificar respuesta en completar palabras
  const verificarRespuesta = (respuesta: string, correcta: string) => {
    const esCorrecta = respuesta.toLowerCase() === correcta.toLowerCase()
    setMostrarResultado(esCorrecta)

    if (esCorrecta) {
      setPuntuacion((prev) => prev + 10)
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }, 300)
    }

    setRespuestas([...respuestas, esCorrecta])

    setTimeout(() => {
      setMostrarResultado(null)
      if (preguntaActual < 9) {
        setPreguntaActual((prev) => prev + 1)
      } else {
        setActividadCompletada(true)
      }
    }, 1500)
  }

  // Función para verificar respuesta en dictado
  const verificarDictado = () => {
    const esCorrecta = respuestaDictado.toLowerCase().trim() === palabraDictado.toLowerCase()
    setMostrarResultado(esCorrecta)

    if (esCorrecta) {
      setPuntuacion((prev) => prev + 10)
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }, 300)
    }

    setRespuestas([...respuestas, esCorrecta])

    setTimeout(() => {
      setMostrarResultado(null)
      setRespuestaDictado("")
      if (preguntaActual < 9) {
        const nuevaPregunta = preguntaActual + 1
        setPreguntaActual(nuevaPregunta)
        setPalabraDictado(palabrasDictado[nuevaPregunta])
      } else {
        setActividadCompletada(true)
      }
    }, 1500)
  }

  // Función para cambiar de actividad sin recargar la página
  const cambiarActividad = (nuevaActividad: Actividad) => {
    // Prevenir el comportamiento predeterminado para evitar recargas
    setActividad(nuevaActividad)
    setPreguntaActual(0)
    setRespuestas([])
    setMostrarResultado(null)
    setActividadCompletada(false)

    if (nuevaActividad === "dictado") {
      setPalabraDictado(palabrasDictado[0])
    } else if (nuevaActividad === "sopa") {
      generarSopaDeLetras()
    }
  }

  // Función para volver al inicio sin recargar la página
  const volverAlInicio = (e: React.MouseEvent) => {
    e.preventDefault() // Prevenir el comportamiento predeterminado
    router.push("/")
  }

  // Generar sopa de letras
  const generarSopaDeLetras = () => {
    const tamaño = 15
    // Inicializar la sopa con espacios vacíos
    const sopa: string[][] = Array(tamaño)
      .fill(0)
      .map(() => Array(tamaño).fill(""))

    // Direcciones: horizontal, vertical, diagonal hacia abajo, diagonal hacia arriba
    const direcciones = [
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 1, dy: 1 },
      { dx: 1, dy: -1 },
    ]

    const palabrasColocadas: { palabra: string; celdas: { row: number; col: number }[] }[] = []
    const palabrasAColocar = [...palabrasSopa] // Hacer una copia para no modificar el original

    // Intentar colocar cada palabra
    for (const palabra of palabrasAColocar) {
      let colocada = false
      let intentos = 0
      const maxIntentos = 100

      while (!colocada && intentos < maxIntentos) {
        intentos++

        // Elegir dirección aleatoria
        const dir = direcciones[Math.floor(Math.random() * direcciones.length)]

        // Calcular límites válidos para la posición inicial
        const maxRow = dir.dy >= 0 ? tamaño - palabra.length * Math.abs(dir.dy) : tamaño - 1
        const minRow = dir.dy < 0 ? palabra.length * Math.abs(dir.dy) - 1 : 0
        const maxCol = dir.dx >= 0 ? tamaño - palabra.length * Math.abs(dir.dx) : tamaño - 1
        const minCol = dir.dx < 0 ? palabra.length * Math.abs(dir.dx) - 1 : 0

        // Elegir posición inicial aleatoria dentro de los límites válidos
        const startRow = minRow + Math.floor(Math.random() * (maxRow - minRow + 1))
        const startCol = minCol + Math.floor(Math.random() * (maxCol - minCol + 1))

        // Verificar si no hay conflicto con otras palabras
        let conflicto = false
        const celdas: { row: number; col: number }[] = []

        for (let i = 0; i < palabra.length; i++) {
          const row = startRow + i * dir.dy
          const col = startCol + i * dir.dx

          // Verificar que estamos dentro de los límites
          if (row < 0 || row >= tamaño || col < 0 || col >= tamaño) {
            conflicto = true
            break
          }

          celdas.push({ row, col })

          // Si la celda ya tiene una letra, debe ser la misma que queremos colocar
          if (sopa[row][col] !== "" && sopa[row][col] !== palabra[i]) {
            conflicto = true
            break
          }
        }

        if (!conflicto) {
          // Colocar la palabra
          for (let i = 0; i < palabra.length; i++) {
            const row = startRow + i * dir.dy
            const col = startCol + i * dir.dx
            sopa[row][col] = palabra[i]
          }
          palabrasColocadas.push({ palabra, celdas })
          colocada = true
        }
      }

      // Si después de muchos intentos no se pudo colocar, seguir con la siguiente
      if (!colocada) {
        console.warn(`No se pudo colocar la palabra: ${palabra}`)
      }
    }

    // Llenar los espacios vacíos con letras aleatorias
    for (let i = 0; i < tamaño; i++) {
      for (let j = 0; j < tamaño; j++) {
        if (sopa[i][j] === "") {
          sopa[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26))
        }
      }
    }

    setSopaLetras(sopa)
    setPalabrasSeleccionadas(palabrasColocadas)
  }

  // Inicializar dictado y sopa de letras
  useEffect(() => {
    if (actividad === "dictado" && palabraDictado === "") {
      setPalabraDictado(palabrasDictado[0])
    } else if (actividad === "sopa" && sopaLetras.length === 0) {
      generarSopaDeLetras()
    }
  }, [actividad, palabraDictado])

  // Manejar selección en sopa de letras
  const handleCeldaMouseDown = (row: number, col: number) => {
    setSeleccionInicio({ row, col })
    setSeleccionActual({ row, col })
  }

  const handleCeldaMouseEnter = (row: number, col: number) => {
    if (seleccionInicio) {
      setSeleccionActual({ row, col })
    }
  }

  const handleCeldaMouseUp = () => {
    if (seleccionInicio && seleccionActual) {
      // Verificar si es una selección válida (horizontal, vertical o diagonal)
      const dx = seleccionActual.col - seleccionInicio.col
      const dy = seleccionActual.row - seleccionInicio.row

      // Debe ser una línea recta
      if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) {
        const longitud = Math.max(Math.abs(dx), Math.abs(dy)) + 1
        const dirX = dx === 0 ? 0 : dx > 0 ? 1 : -1
        const dirY = dy === 0 ? 0 : dy > 0 ? 1 : -1

        // Construir la palabra seleccionada
        let palabra = ""
        const celdas: { row: number; col: number }[] = []

        for (let i = 0; i < longitud; i++) {
          const row = seleccionInicio.row + i * dirY
          const col = seleccionInicio.col + i * dirX
          palabra += sopaLetras[row][col]
          celdas.push({ row, col })
        }

        // Verificar si la palabra está en la lista
        const palabraEncontrada = palabrasSeleccionadas.find(
          (p) => p.palabra === palabra || p.palabra === palabra.split("").reverse().join(""),
        )

        if (palabraEncontrada && !palabrasEncontradas.includes(palabraEncontrada.palabra)) {
          setPalabrasEncontradas([...palabrasEncontradas, palabraEncontrada.palabra])
          setPuntuacion((prev) => prev + 20)

          setTimeout(() => {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            })
          }, 300)

          // Verificar si se han encontrado todas las palabras
          if (palabrasEncontradas.length + 1 === palabrasSopa.length) {
            setActividadCompletada(true)
          }
        }
      }
    }

    setSeleccionInicio(null)
    setSeleccionActual(null)
  }

  // Verificar si una celda está en la selección actual
  const esCeldaSeleccionada = (row: number, col: number) => {
    if (!seleccionInicio || !seleccionActual) return false

    const dx = seleccionActual.col - seleccionInicio.col
    const dy = seleccionActual.row - seleccionInicio.row

    // Debe ser una línea recta
    if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) {
      const longitud = Math.max(Math.abs(dx), Math.abs(dy)) + 1
      const dirX = dx === 0 ? 0 : dx > 0 ? 1 : -1
      const dirY = dy === 0 ? 0 : dy > 0 ? 1 : -1

      for (let i = 0; i < longitud; i++) {
        const r = seleccionInicio.row + i * dirY
        const c = seleccionInicio.col + i * dirX
        if (r === row && c === col) return true
      }
    }

    return false
  }

  // Verificar si una celda está en una palabra encontrada
  const esCeldaPalabraEncontrada = (row: number, col: number) => {
    return palabrasSeleccionadas.some(
      (p) => palabrasEncontradas.includes(p.palabra) && p.celdas.some((c) => c.row === row && c.col === col),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-300 to-yellow-200 overflow-hidden relative">
      {/* Elementos decorativos con posiciones fijas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {elementosDecorativosPos.map((elem, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${elem.color}`}
            style={{
              width: elem.size,
              height: elem.size,
              top: elem.top,
              left: elem.left,
              opacity: 0.6,
              animation: `float ${Math.random() * 5 + 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Encabezado */}
        <header className="mb-8 flex items-center justify-between">
          <button
            onClick={volverAlInicio}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>

          <h1 className="text-3xl md:text-4xl font-bold text-center text-purple-800">Unidad 1: Sonidos y Letras</h1>

          <div className="w-24 flex justify-end">
            <div className="bg-white/80 rounded-full px-3 py-1 flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-purple-800">{puntuacion}</span>
            </div>
          </div>
        </header>

        {/* Selector de actividades */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => cambiarActividad("diferencias")}
            className={`px-4 py-2 rounded-full font-bold cursor-pointer ${
              actividad === "diferencias" ? "bg-teal-400 text-white" : "bg-white/70 text-teal-600 hover:bg-white"
            } transition-colors`}
          >
            Diferencias B/V, C/S/Z, G/J
          </button>
          <button
            onClick={() => cambiarActividad("completar")}
            className={`px-4 py-2 rounded-full font-bold cursor-pointer ${
              actividad === "completar" ? "bg-orange-400 text-white" : "bg-white/70 text-orange-600 hover:bg-white"
            } transition-colors`}
          >
            Completar Palabras
          </button>
          <button
            onClick={() => cambiarActividad("dictado")}
            className={`px-4 py-2 rounded-full font-bold cursor-pointer ${
              actividad === "dictado" ? "bg-purple-600 text-white" : "bg-white/70 text-purple-600 hover:bg-white"
            } transition-colors`}
          >
            Dictado Interactivo
          </button>
          <button
            onClick={() => cambiarActividad("sopa")}
            className={`px-4 py-2 rounded-full font-bold cursor-pointer ${
              actividad === "sopa" ? "bg-red-500 text-white" : "bg-white/70 text-red-500 hover:bg-white"
            } transition-colors`}
          >
            Sopa de Letras
          </button>
        </div>

        {/* Contenido principal */}
        <div className="bg-white/80 rounded-3xl p-6 shadow-lg max-w-4xl mx-auto">
          {/* Diferencias entre letras */}
          {actividad === "diferencias" && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-purple-800 mb-6">
                Diferencias entre {letrasConfusasData[grupoActual].grupo}
              </h2>

              <p className="text-lg text-purple-700 mb-6">{letrasConfusasData[grupoActual].descripcion}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {letrasConfusasData[grupoActual].ejemplos.map((ejemplo, index) => (
                  <div key={index} className="bg-purple-100 p-4 rounded-xl">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-purple-800">
                        {ejemplo.palabra.replace(ejemplo.letra, `<${ejemplo.letra.toUpperCase()}>`)}
                      </span>
                      <button
                        onClick={() => reproducirSonido(ejemplo.palabra)}
                        className="bg-teal-400 text-white p-1 rounded-full hover:bg-teal-500 transition-colors cursor-pointer"
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-purple-700">{ejemplo.explicacion}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setGrupoActual((prev) => (prev > 0 ? prev - 1 : letrasConfusasData.length - 1))}
                  className="bg-orange-400 text-white px-6 py-3 rounded-full font-bold hover:bg-orange-500 transition-colors cursor-pointer"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setGrupoActual((prev) => (prev < letrasConfusasData.length - 1 ? prev + 1 : 0))}
                  className="bg-teal-400 text-white px-6 py-3 rounded-full font-bold hover:bg-teal-500 transition-colors cursor-pointer"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {/* Completar palabras */}
          {actividad === "completar" && (
            <div className="text-center">
              {!actividadCompletada ? (
                <>
                  <div className="flex justify-between mb-4">
                    <div className="text-purple-800 font-bold">Pregunta {preguntaActual + 1}/10</div>
                    <div className="flex gap-1">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 rounded-full ${
                            i < preguntaActual ? (respuestas[i] ? "bg-green-500" : "bg-red-500") : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-purple-800 mb-4">Completa la palabra con la letra correcta</h2>

                  <p className="text-lg text-purple-600 mb-2">Pista: {palabrasCompletar[preguntaActual].pista}</p>

                  <div className="flex justify-center items-center gap-2 mb-8">
                    <div className="text-4xl font-bold tracking-widest text-purple-800">
                      {palabrasCompletar[preguntaActual].palabra.replace("_", "_")}
                    </div>
                  </div>

                  <div className="flex justify-center gap-6 mb-8">
                    {palabrasCompletar[preguntaActual].opciones.map((opcion, index) => (
                      <button
                        key={index}
                        onClick={() => verificarRespuesta(opcion, palabrasCompletar[preguntaActual].correcta)}
                        className={`w-20 h-20 text-4xl font-bold rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                          mostrarResultado !== null
                            ? opcion === palabrasCompletar[preguntaActual].correcta
                              ? "bg-green-500 text-white transform scale-110"
                              : "bg-red-100 text-gray-400"
                            : "bg-white text-purple-800 hover:bg-purple-100"
                        } ${mostrarResultado !== null ? "pointer-events-none" : ""}`}
                      >
                        {opcion}
                      </button>
                    ))}
                  </div>

                  {mostrarResultado !== null && (
                    <div className={`text-xl font-bold ${mostrarResultado ? "text-green-500" : "text-red-500"}`}>
                      {mostrarResultado ? (
                        <div className="flex items-center justify-center gap-2">
                          <Check size={24} />
                          <span>¡Correcto!</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <X size={24} />
                          <span>Inténtalo de nuevo</span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-bold text-purple-800 mb-4">¡Actividad Completada!</h2>
                  <p className="text-xl text-purple-600 mb-8">
                    Has respondido {respuestas.filter((r) => r).length} de 10 preguntas correctamente
                  </p>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => cambiarActividad(actividad)}
                      className="bg-teal-400 text-white px-6 py-3 rounded-full font-bold hover:bg-teal-500 transition-colors flex items-center gap-2"
                    >
                      <HelpCircle size={20} />
                      <span>Jugar de nuevo</span>
                    </button>
                    <button
                      onClick={() => cambiarActividad("diferencias")}
                      className="bg-purple-600 text-white px-6 py-3 rounded-full font-bold hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                      <Award size={20} />
                      <span>Volver a inicio</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dictado interactivo */}
          {actividad === "dictado" && (
            <div className="text-center">
              {!actividadCompletada ? (
                <>
                  <div className="flex justify-between mb-4">
                    <div className="text-purple-800 font-bold">Palabra {preguntaActual + 1}/10</div>
                    <div className="flex gap-1">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 rounded-full ${
                            i < preguntaActual ? (respuestas[i] ? "bg-green-500" : "bg-red-500") : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-purple-800 mb-6">Dictado Interactivo</h2>
                  <p className="text-lg text-purple-600 mb-6">Escucha la palabra y escríbela correctamente</p>

                  <div className="flex justify-center mb-8">
                    <button
                      onClick={() => reproducirSonido(palabraDictado)}
                      className="bg-purple-600 text-white p-4 rounded-full hover:bg-purple-700 transition-colors cursor-pointer"
                    >
                      <Mic size={32} />
                    </button>
                  </div>

                  <div className="mb-8">
                    <input
                      type="text"
                      value={respuestaDictado}
                      onChange={(e) => setRespuestaDictado(e.target.value)}
                      placeholder="Escribe la palabra aquí..."
                      className="w-full max-w-md px-4 py-3 text-xl text-purple-700 text-center rounded-xl border-2 border-purple-300 focus:border-purple-500 focus:outline-none"
                      disabled={mostrarResultado !== null}
                    />
                  </div>

                  <button
                    onClick={verificarDictado}
                    className="bg-teal-400 text-white px-6 py-3 rounded-full font-bold hover:bg-teal-500 transition-colors cursor-pointer"
                    disabled={respuestaDictado.trim() === "" || mostrarResultado !== null}
                  >
                    Comprobar
                  </button>

                  {mostrarResultado !== null && (
                    <div className={`mt-4 text-xl font-bold ${mostrarResultado ? "text-green-500" : "text-red-500"}`}>
                      {mostrarResultado ? (
                        <div className="flex items-center justify-center gap-2">
                          <Check size={24} />
                          <span>¡Correcto!</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="flex items-center">
                            <X size={24} />
                            <span>Incorrecto</span>
                          </div>
                          <p className="text-lg">
                            La palabra correcta es: <strong>{palabraDictado}</strong>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-bold text-purple-800 mb-4">¡Dictado Completado!</h2>
                  <p className="text-xl text-purple-600 mb-8">
                    Has escrito correctamente {respuestas.filter((r) => r).length} de 10 palabras
                  </p>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => cambiarActividad(actividad)}
                      className="bg-teal-400 text-white px-6 py-3 rounded-full font-bold hover:bg-teal-500 transition-colors flex items-center gap-2"
                    >
                      <HelpCircle size={20} />
                      <span>Jugar de nuevo</span>
                    </button>
                    <button
                      onClick={() => cambiarActividad("diferencias")}
                      className="bg-purple-600 text-white px-6 py-3 rounded-full font-bold hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                      <Award size={20} />
                      <span>Volver a inicio</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sopa de letras */}
          {actividad === "sopa" && (
  <div className="text-center">
    {!actividadCompletada ? (
      <>
        <h2 className="text-2xl font-bold text-purple-800 mb-4">Sopa de Letras</h2>
        <p className="text-lg text-purple-600 mb-4">
          Encuentra las palabras relacionadas con las letras que estamos aprendiendo
        </p>
        

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div
            className="bg-purple-100 p-4 rounded-xl w-full md:w-auto"
            ref={sopaRef}
            onMouseLeave={handleCeldaMouseUp}
          >
            <div className="grid grid-cols-15 gap-0 mx-auto w-max">
              {sopaLetras.flatMap((fila, rowIndex) =>
                fila.map((letra, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`w-7 h-7 flex items-center justify-center font-bold text-sm border border-purple-200 select-none cursor-pointer
                      ${
                        esCeldaPalabraEncontrada(rowIndex, colIndex)
                          ? "bg-green-300 text-green-800"
                          : esCeldaSeleccionada(rowIndex, colIndex)
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-white text-purple-800"
                      }`}
                    onMouseDown={() => handleCeldaMouseDown(rowIndex, colIndex)}
                    onMouseEnter={() => handleCeldaMouseEnter(rowIndex, colIndex)}
                    onMouseUp={handleCeldaMouseUp}
                  >
                    {letra}
                  </div>
                ))
              )}
            </div>
          </div>

                    <div className="bg-purple-100 p-4 rounded-xl flex-1">
                      <h3 className="text-lg font-bold text-purple-800 mb-2">Palabras a encontrar:</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {palabrasSopa.map((palabra, index) => (
                          <div
                            key={index}
                            className={`px-3 py-1 rounded-full text-sm font-bold ${
                              palabrasEncontradas.includes(palabra)
                                ? "bg-green-300 text-green-800 line-through"
                                : "bg-white text-purple-800"
                            }`}
                          >
                            {palabra}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-purple-600">
                        <p>
                          Encontradas: {palabrasEncontradas.length} de {palabrasSopa.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-bold text-purple-800 mb-4">¡Sopa de Letras Completada!</h2>
                  <p className="text-xl text-purple-600 mb-8">Has encontrado todas las palabras. ¡Felicidades!</p>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => cambiarActividad(actividad)}
                      className="bg-teal-400 text-white px-6 py-3 rounded-full font-bold hover:bg-teal-500 transition-colors flex items-center gap-2"
                    >
                      <HelpCircle size={20} />
                      <span>Jugar de nuevo</span>
                    </button>
                    <button
                      onClick={() => cambiarActividad("diferencias")}
                      className="bg-purple-600 text-white px-6 py-3 rounded-full font-bold hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                      <Award size={20} />
                      <span>Volver a inicio</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
