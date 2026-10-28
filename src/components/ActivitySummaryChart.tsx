import React from "react";
import { useResource } from "../hooks/useResource";
import {
  generateLast7DaysActivities,
  calculateActivityStats,
} from "../utils/activityMetrics";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
export function ActivitySummaryChart() {
  const resource = useResource<Array<{ type: string; createdAt: string }>>(
    "/activity",
    [],
  );
  const activities = generateLast7DaysActivities(new Date(), resource.data);
  const stats = calculateActivityStats(activities);
  return (
    <section className="bg-white border rounded-3xl p-6">
      <h2 className="text-xl font-serif font-bold mb-3">
        Atividade dos últimos sete dias
      </h2>
      {resource.error ? (
        <p role="alert">
          {resource.error}{" "}
          <button onClick={() => void resource.reload()}>
            Tentar novamente
          </button>
        </p>
      ) : (
        <>
          <p>
            {resource.loading
              ? "Carregando…"
              : stats.totalGeneral + " conteúdos gerados (chat não incluído)."}
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activities}>
                <XAxis dataKey="dayLabel" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar name="Pregações" dataKey="sermoes" fill="#d97706" />
                <Bar name="EBD" dataKey="ebd" fill="#6366f1" />
                <Bar name="Exegeses" dataKey="estudos" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </section>
  );
}
