import { ResponsiveContainer, Pie, Cell, PieChart, Tooltip } from "recharts";
import { toPieData } from "@/lib/utils/macros";
import { PIE_CHART_COLORS } from "@/lib/constants/chart";
import type { Macros } from "@/types/nutrition";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { formatPct } from "@/lib/utils/format";

export default function MacroPie({
  macros,
  height = 220,
}: {
  macros: Macros;
  height?: number;
}) {
  const data = toPieData(macros);
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={85}
          >
            {data.map((entry, index) => (
              <Cell
                key={`slice-${entry.name}`}
                fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(v: ValueType, n: NameType) => [
              `${v} kcal (${formatPct(Number(v), total)})`,
              n,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 grid grid-cols-3 text-xs text-muted-foreground">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-1">
            <span
              className="inline-block h-2 w-2 rounded"
              style={{
                background: PIE_CHART_COLORS[i % PIE_CHART_COLORS.length],
              }}
            />
            <span>{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
