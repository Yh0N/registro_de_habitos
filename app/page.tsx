"use client";

import { CategoryScale, Chart, Legend, LinearScale, LineController, LineElement, PointElement, SubTitle, Title, Tooltip } from 'chart.js';
import { useEffect, useRef, useState } from 'react';

Chart.register(LineController, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, SubTitle);

type Habit = {
  name: string;
  completed: boolean;
};

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState<string>("");

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([...habits, { name: newHabit, completed: false }]);
      setNewHabit("");
    }
  };

  const toggleCompleted = (index: number) => {
    const updatedHabits = habits.map((habit, i) => 
      i === index ? { ...habit, completed: !habit.completed } : habit
    );
    setHabits(updatedHabits);
  };

  const deleteHabit = (index: number) => {
    const updatedHabits = habits.filter((_, i) => i !== index);
    setHabits(updatedHabits);
  };

  const calculateProgress = () => {
    if (habits.length === 0) return 0;
    const completed = habits.filter(habit => habit.completed).length;
    return (completed / habits.length) * 100;
  };

  const initializeChart = () => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx && !chartInstanceRef.current) {
        const data = {
          labels: habits.map((_, i) => `Habit ${i + 1}`),
          datasets: [
            {
              label: 'Habit Progress',
              data: habits.map(h => (h.completed ? 100 : 0)),
              fill: false,
              borderColor: '#4f46e5',
              backgroundColor: 'rgba(255, 255, 255, 0)',
              tension: 0.4,
              pointRadius: 6,
              borderWidth: 2,
            }
          ],
        };

        const options = {
          plugins: {
            title: {
              display: true,
              text: 'Habit Progress Chart',
              font: {
                size: 24,
                weight: 'bold' as const, // 'as const' ensures TypeScript treats it as a specific literal type
              },
              color: '#4f46e5'
            },
            subtitle: {
              display: true,
              text: 'Daily progress of completed habits',
              font: {
                size: 18
              },
              color: 'rgba(79, 70, 229, 0.7)'
            },
            tooltip: {
              backgroundColor: '#4f46e5',
              titleColor: '#ffffff',
              bodyColor: '#ffffff',
              borderColor: 'rgba(79, 70, 229, 0.6)',
              borderWidth: 1
            },
            legend: {
              labels: {
                color: '#4f46e5'
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Progress (%)',
                font: {
                  size: 18
                },
                color: '#4f46e5'
              },
              grid: {
                borderColor: 'rgba(79, 70, 229, 0.1)',
                borderWidth: 1,
                color: 'rgba(79, 70, 229, 0.1)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Habits',
                font: {
                  size: 18
                },
                color: '#4f46e5'
              },
              grid: {
                borderColor: 'rgba(79, 70, 229, 0.1)',
                borderWidth: 1,
                color: 'rgba(79, 70, 229, 0.1)'
              }
            }
          },
          elements: {
            line: {
              borderColor: '#4f46e5',
            },
            point: {
              backgroundColor: '#4f46e5',
            }
          }
        };

        chartInstanceRef.current = new Chart(ctx, {
          type: 'line',
          data,
          options,
        });
      }
    }
  };

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.data.labels = habits.map((_, i) => `Habit ${i + 1}`);
      chartInstanceRef.current.data.datasets[0].data = habits.map(h => (h.completed ? 100 : 0));
      chartInstanceRef.current.update();
    }
  }, [habits]);

  useEffect(() => {
    initializeChart();
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-100 p-10">
      <div className="grid grid-cols-3 gap-6">

        <div className="col-span-3 text-center mb-8">
          <h1 className="text-5xl font-extrabold text-indigo-700">Registro de Hábitos</h1>
        </div>

        <div className="col-span-1 flex items-center justify-center bg-gray-100">
          <img
            src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRd5gWBS46Ue0wBsjARpzlhbSLbXils86r8N57mJZ_kLKaaGYFm"
            alt="Logo"
            className="h-36 object-contain"
          />
        </div>

        <div className="col-span-2 bg-gray-100 flex flex-col items-center p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-indigo-700 mb-6">Agregar Nuevo Hábito</h2>
          <div className="flex items-center mb-8 w-full max-w-lg">
            <input
              type="text"
              placeholder="Nuevo hábito"
              className="p-4 border border-gray-300 rounded-l-md w-full text-lg"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
            />
            <button
              className="px-8 py-4 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 transition duration-300 text-lg"
              onClick={addHabit}
            >
              Agregar
            </button>
          </div>

          <h2 className="text-2xl font-semibold text-indigo-700 mb-6">Lista de Hábitos</h2>
          <ul className="list-disc list-inside text-left w-full max-w-md">
            {habits.map((habit, index) => (
              <li key={index} className="flex items-center mb-3">
                <input
                  type="checkbox"
                  className="mr-3 h-6 w-6 accent-indigo-600"
                  checked={habit.completed}
                  onChange={() => toggleCompleted(index)}
                />
                <span className={`text-lg text-gray-800 ${habit.completed ? 'line-through' : ''}`}>
                  {index + 1}. {habit.name}
                </span>
                <button
                  className="ml-4 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
                  onClick={() => deleteHabit(index)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

          <div className="bg-gray-100 p-8 text-center rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-indigo-700 mb-6">Progreso</h3>
            <div className="relative w-full">
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className="bg-indigo-600 h-6 rounded-full"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
              <p className="mt-4 text-xl font-medium text-indigo-700">
                {calculateProgress().toFixed(2)}% completado
              </p>
            </div>
          </div>

          <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-indigo-700 mb-6">Gráfico de Progreso</h3>
            <canvas ref={chartRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
