/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DayActivity {
  dayKey: string; // e.g. '21/10'
  dayLabel: string; // e.g. 'Seg'
  fullDate: string; // e.g. '21 de Out'
  sermoes: number;
  ebd: number;
  estudos: number;
  total: number;
}

export interface ActivitySummaryStats {
  totalSermoes: number;
  totalEbd: number;
  totalEstudos: number;
  totalGeneral: number;
  mostActiveDay: string;
  averagePerDay: number;
}

/**
 * Generates initial 7-day ministerial activity data up to the current date.
 */
export function generateLast7DaysActivities(
  baseDate: Date = new Date(),
  events: Array<{ type: string; createdAt: string }> = [],
): DayActivity[] {
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const monthNames = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  const result: DayActivity[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);

    const dayName = dayNames[d.getDay()];
    const dayOfMonth = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const monthName = monthNames[d.getMonth()];

    const sameDay = events.filter(
      (e) => new Date(e.createdAt).toDateString() === d.toDateString(),
    );
    const sample = {
      sermoes: sameDay.filter((e) => e.type === "sermon").length,
      ebd: sameDay.filter((e) => e.type === "ebd").length,
      estudos: sameDay.filter((e) => e.type === "xray").length,
    };
    const total = sample.sermoes + sample.ebd + sample.estudos;

    result.push({
      dayKey: `${dayOfMonth}/${month}`,
      dayLabel: `${dayName} (${dayOfMonth})`,
      fullDate: `${dayOfMonth} de ${monthName}`,
      sermoes: sample.sermoes,
      ebd: sample.ebd,
      estudos: sample.estudos,
      total,
    });
  }

  return result;
}

/**
 * Calculates aggregate statistics from 7-day activity data.
 */
export function calculateActivityStats(
  activities: DayActivity[],
): ActivitySummaryStats {
  let totalSermoes = 0;
  let totalEbd = 0;
  let totalEstudos = 0;
  let maxTotal = -1;
  let mostActiveDay = "";

  for (const day of activities) {
    totalSermoes += day.sermoes;
    totalEbd += day.ebd;
    totalEstudos += day.estudos;

    if (day.total > maxTotal) {
      maxTotal = day.total;
      mostActiveDay = day.dayLabel;
    }
  }

  const totalGeneral = totalSermoes + totalEbd + totalEstudos;
  const count = activities.length || 1;
  const averagePerDay = Number((totalGeneral / count).toFixed(1));

  return {
    totalSermoes,
    totalEbd,
    totalEstudos,
    totalGeneral,
    mostActiveDay,
    averagePerDay,
  };
}
