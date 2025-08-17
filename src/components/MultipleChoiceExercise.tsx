"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  getExercisePoints,
  markExerciseAsCompleted,
} from "@/actions/exerciseActions";

type Question = {
  question: string;
  options: string[];
  answer: string;
  points: number;
  explanation?: string;
};

type MultipleChoiceExerciseProps = {
  name: string;
  questions: Question[];
  level: number;
};

export const MultipleChoiceExercise = ({
  name,
  questions,
  level,
}: MultipleChoiceExerciseProps) => {
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [totalPoints, setTotalPoints] = useState<number>(0);

  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  // TODO: maybe use context for user state
  useEffect(() => {
    const initExercise = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const points = await getExercisePoints(name);
          setTotalPoints(points);
        }
      } catch (error) {
        console.error("Error initializing exercise:", error);
      }
    };

    initExercise();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [name]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const answers = Array.from(formData.entries());

    const { results, points } = answers.reduce(
      (acc, [question, answer]) => {
        const questionObj = questions.find((q) => q.question === question);
        if (questionObj) {
          const isCorrect = answer === questionObj.answer;
          acc.results[question] = isCorrect;
          if (isCorrect) {
            acc.points += questionObj.points;
          }
        }
        return acc;
      },
      { results: {} as Record<string, boolean>, points: 0 }
    );

    setResults(results);
    setTotalPoints(points);
    markExerciseAsCompleted(name, points);
  };

  const maxPoints = questions.reduce(
    (acc, question) => acc + question.points,
    0
  );

  return (
    <div className="rounded shadow-lg p-4">
      {!user && (
        <p className="text-yellow-800 text-sm text-center">
          🔒 Kirjaudu sisään kerätäksesi pisteitä tästä tehtävästä
        </p>
      )}
      <div className="flex justify-between items-center">
        <h3>
          {"⭐".repeat(level)} {name}
        </h3>
        <p
          className={`mt-8 font-semibold ${
            totalPoints === maxPoints ? "text-green-600" : "text-blue-600"
          }`}
        >
          Pisteet: {totalPoints} / {maxPoints}
        </p>
      </div>
      <form className="flex flex-col gap-4 p-4" onSubmit={handleSubmit}>
        {questions.map((q, index) => (
          <div key={index}>
            <h4>{q.question}</h4>

            {q.options.map((option, idx) => (
              <div className="flex gap-4" key={idx}>
                <input type="radio" name={q.question} value={option} />
                <label>{option}</label>
              </div>
            ))}
            {results[q.question] !== undefined && (
              <div>
                <span>{results[q.question] ? "Oikein! ✅" : "Väärin! ❌"}</span>
                {results[q.question] && q.explanation && (
                  <p className="text-blue-600">{q.explanation}</p>
                )}
              </div>
            )}
          </div>
        ))}
        <button
          className="w-24 bg-blue-600 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Tarkista
        </button>
      </form>
    </div>
  );
};
