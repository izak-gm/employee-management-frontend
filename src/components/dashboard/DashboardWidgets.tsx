import { Box, Paper, Typography, Stack, LinearProgress } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import type { ReactNode } from "react";

/* ---------------------------------------------------------------------- */
/*  StatCard — the ledger-style KPI tile used across all three dashboards */
/* ---------------------------------------------------------------------- */

export const StatCard = ({
  icon,
  label,
  value,
  color = "#0F2A4A",
  sublabel,
  emphasis = false,
}: {
  icon: ReactNode;
  label: string;
  value: number | string;
  color?: string;
  sublabel?: string;
  /** Use for the single "hero" KPI (e.g. leave balance) to make it stand out */
  emphasis?: boolean;
}) => (
  <Paper
    sx={{
      p: emphasis ? 3.5 : 3,
      height: "100%",
      border: "1px solid",
      borderColor: "divider",
      borderLeft: "4px solid",
      borderLeftColor: color,
      borderRadius: "10px 10px 10px 4px",
    }}
  >
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1.5 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          bgcolor: `${color}1A`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Box sx={{ color, display: "flex" }}>{icon}</Box>
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          fontWeight: 600,
          letterSpacing: "0.03em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
    </Stack>
    <Typography
      sx={{
        fontFamily: '"Roboto Mono", "Consolas", monospace',
        fontWeight: 700,
        fontSize: emphasis ? 40 : 28,
        lineHeight: 1.1,
      }}
    >
      {value}
    </Typography>
    {sublabel && (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {sublabel}
      </Typography>
    )}
  </Paper>
);

/* ---------------------------------------------------------------------- */
/*  Donut — CSS conic-gradient ring, no chart library dependency          */
/* ---------------------------------------------------------------------- */

export type Segment = { label: string; value: number; color: string };

export const Donut = ({
  segments,
  centerLabel,
  size = 132,
}: {
  segments: Segment[];
  centerLabel?: string;
  size?: number;
}) => {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  let acc = 0;
  const stops = segments
    .map((seg) => {
      const start = (acc / total) * 360;
      acc += seg.value;
      const end = (acc / total) * 360;
      return `${seg.color} ${start}deg ${end}deg`;
    })
    .join(", ");

  return (
    <Stack direction="row" spacing={3} sx={{ alignItems: "center" }}>
      <Box
        sx={{
          position: "relative",
          width: size,
          height: size,
          borderRadius: "50%",
          background: total > 0 ? `conic-gradient(${stops})` : "none",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: size * 0.16,
            borderRadius: "50%",
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: 22, lineHeight: 1 }}>{total}</Typography>
          {centerLabel && (
            <Typography variant="caption" color="text.secondary">
              {centerLabel}
            </Typography>
          )}
        </Box>
      </Box>
      <Stack spacing={1}>
        {segments.map((seg) => (
          <Stack key={seg.label} direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: seg.color,
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 90 }}>
              {seg.label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {seg.value}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

/* ---------------------------------------------------------------------- */
/*  BarList — horizontal proportional bars (e.g. requests by leave type)  */
/* ---------------------------------------------------------------------- */

export const BarList = ({ segments }: { segments: Segment[] }) => {
  const max = Math.max(1, ...segments.map((s) => s.value));
  return (
    <Stack spacing={1.5}>
      {segments.map((seg) => (
        <Box key={seg.label}>
          <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              {seg.label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {seg.value}
            </Typography>
          </Stack>
          <Box
            sx={{
              height: 8,
              borderRadius: 3,
              bgcolor: "divider",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: "100%",
                borderRadius: 3,
                bgcolor: seg.color,
                width: `${(seg.value / max) * 100}%`,
                transition: "width 0.3s ease",
              }}
            />
          </Box>
        </Box>
      ))}
    </Stack>
  );
};

/* ---------------------------------------------------------------------- */
/*  TrendBars — simple monthly column chart, last N months                */
/* ---------------------------------------------------------------------- */

export const TrendBars = ({
  data,
  color = "#0F2A4A",
}: {
  data: { label: string; value: number }[];
  color?: string;
}) => {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-end", height: 140, px: 1 }}>
      {data.map((d) => (
        <Stack
          key={d.label}
          spacing={0.75}
          sx={{
            alignItems: "center",
            flex: 1,
            height: "100%",
            justifyContent: "flex-end",
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            {d.value}
          </Typography>
          <Box
            sx={{
              width: "100%",
              maxWidth: 28,
              minHeight: 3,
              height: `${(d.value / max) * 90}%`,
              bgcolor: color,
              borderRadius: "4px 4px 0 0",
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {d.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};

/* ---------------------------------------------------------------------- */
/*  ProgressRow — one leave type's usage vs entitlement                   */
/* ---------------------------------------------------------------------- */

export const ProgressRow = ({
  label,
  used,
  max,
  unlimited,
  color,
}: {
  label: string;
  used: number;
  max: number;
  unlimited?: boolean;
  color: string;
}) => (
  <Box>
    <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.5 }}>
      <Typography variant="body2">{label}</Typography>
      <Typography variant="body2" color="text.secondary">
        {unlimited ? `${used} taken · unlimited` : `${used} / ${max} days`}
      </Typography>
    </Stack>
    <LinearProgress
      variant="determinate"
      value={unlimited ? Math.min(100, used * 5) : Math.min(100, (used / Math.max(max, 1)) * 100)}
      sx={{
        height: 8,
        borderRadius: 3,
        bgcolor: "divider",
        "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 3 },
      }}
    />
  </Box>
);

/* ---------------------------------------------------------------------- */
/*  MiniCalendar — current month grid, highlights ISO dates supplied      */
/* ---------------------------------------------------------------------- */

export const MiniCalendar = ({
  highlighted,
  color = "#0F2A4A",
}: {
  /** ISO "YYYY-MM-DD" strings to mark, e.g. approved leave days */
  highlighted: Set<string>;
  color?: string;
}) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay.getDay();
  const todayIso = now.toISOString().slice(0, 10);

  const cells: (string | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const d = String(i + 1).padStart(2, "0");
      const m = String(month + 1).padStart(2, "0");
      return `${year}-${m}-${d}`;
    }),
  ];

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {now.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 0.5,
        }}
      >
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <Typography key={i} variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
            {d}
          </Typography>
        ))}
        {cells.map((iso, i) => {
          const isLeave = iso ? highlighted.has(iso) : false;
          const isToday = iso === todayIso;
          return (
            <Box
              key={i}
              sx={{
                height: 28,
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: isToday ? 700 : 400,
                bgcolor: isLeave ? `${color}1F` : "transparent",
                color: isLeave ? color : isToday ? "text.primary" : "text.secondary",
                border: isToday ? "1px solid" : "none",
                borderColor: color,
              }}
            >
              {iso ? Number(iso.slice(-2)) : ""}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

/* ---------------------------------------------------------------------- */
/*  RoadmapNote — honest placeholder for metrics the API can't give yet   */
/* ---------------------------------------------------------------------- */

export const RoadmapNote = ({ text }: { text: string }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2.5,
      borderStyle: "dashed",
      borderColor: "divider",
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      bgcolor: "action.hover",
    }}
  >
    <InfoOutlinedIcon fontSize="small" color="disabled" />
    <Typography variant="body2" color="text.secondary">
      {text}
    </Typography>
  </Paper>
);

/* ---------------------------------------------------------------------- */
/*  Date helpers — ISO "YYYY-MM-DD" strings sort/compare lexically,       */
/*  so plain string comparisons avoid timezone bugs from Date parsing.   */
/* ---------------------------------------------------------------------- */

export const todayIso = () => new Date().toISOString().slice(0, 10);

export const isOnLeaveToday = (startDate?: string, endDate?: string) => {
  const t = todayIso();
  return !!startDate && !!endDate && startDate <= t && t <= endDate;
};

export const isUpcoming = (startDate?: string) => !!startDate && startDate > todayIso();

export const daysBetweenInclusive = (startDate?: string, endDate?: string) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
};

/** Buckets items with a createdAt date into the last `months` calendar months. */
export const monthBuckets = <T extends { createdAt?: string }>(items: T[], months = 6) => {
  const now = new Date();
  const buckets: { key: string; label: string; value: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString(undefined, { month: "short" }),
      value: 0,
    });
  }
  const byKey = new Map(buckets.map((b) => [b.key, b]));
  items.forEach((item) => {
    if (!item.createdAt) return;
    const key = item.createdAt.slice(0, 7);
    const bucket = byKey.get(key);
    if (bucket) bucket.value += 1;
  });
  return buckets;
};
