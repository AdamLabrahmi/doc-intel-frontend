import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  extractionDistributionData,
  processingEvolutionData,
} from "@/features/dashboard/data/dashboard.mock";

const tooltipContentStyle = {
  borderRadius: "14px",
  border: "1px solid #E2E8F0",
  boxShadow: "0 18px 45px -20px rgba(15, 23, 42, 0.25)",
  fontSize: "12px",
};

export function DashboardCharts() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">
              Évolution des traitements
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Documents importés et terminés sur les 7 derniers jours
            </p>
          </div>

          <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
            Cette semaine
          </span>
        </div>

        <div className="mt-6 h-80 w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={[...processingEvolutionData]}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="documentsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#2563EB"
                    stopOpacity={0.28}
                  />

                  <stop
                    offset="95%"
                    stopColor="#2563EB"
                    stopOpacity={0}
                  />
                </linearGradient>

                <linearGradient
                  id="completedGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#06B6D4"
                    stopOpacity={0.24}
                  />

                  <stop
                    offset="95%"
                    stopColor="#06B6D4"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#E2E8F0"
                vertical={false}
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#64748B",
                  fontSize: 12,
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#64748B",
                  fontSize: 12,
                }}
              />

              <Tooltip contentStyle={tooltipContentStyle} />

              <Legend
                iconType="circle"
                wrapperStyle={{
                  fontSize: "12px",
                  paddingTop: "18px",
                }}
              />

              <Area
                type="monotone"
                dataKey="documents"
                name="Documents importés"
                stroke="#2563EB"
                strokeWidth={3}
                fill="url(#documentsGradient)"
              />

              <Area
                type="monotone"
                dataKey="completed"
                name="Traitements terminés"
                stroke="#06B6D4"
                strokeWidth={3}
                fill="url(#completedGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-slate-950">
            Méthodes d’extraction
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Répartition entre Tika et OCR
          </p>
        </div>

        <div className="mt-6 h-64">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={[...extractionDistributionData]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={92}
                paddingAngle={5}
                strokeWidth={0}
              >
                {extractionDistributionData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={tooltipContentStyle}
                formatter={(value) => [`${value} %`, "Utilisation"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-3">
          {extractionDistributionData.map((entry) => (
            <div
              key={entry.name}
              className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
            >
              <span className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <span
                  className="size-2.5 rounded-full"
                  style={{
                    backgroundColor: entry.color,
                  }}
                />

                {entry.name}
              </span>

              <span className="font-bold text-slate-950">
                {entry.value} %
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}