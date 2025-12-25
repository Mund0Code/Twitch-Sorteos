type Raffle = {
  id: string;
  title: string;
  prize: string;
  createdAt: string;
  participants: string[];
  winner?: string;
};

export function exportHistoryToJSON(history: Raffle[]) {
  const blob = new Blob([JSON.stringify(history, null, 2)], {
    type: "application/json",
  });

  download(blob, "twitch-sorteos-history.json");
}

export function exportHistoryToCSV(history: Raffle[]) {
  const header = [
    "id",
    "title",
    "prize",
    "createdAt",
    "participants_count",
    "participants",
    "winner",
  ];

  const rows = history.map((r) => [
    r.id,
    escape(r.title),
    escape(r.prize),
    r.createdAt,
    r.participants.length,
    escape(r.participants.join(", ")),
    escape(r.winner ?? ""),
  ]);

  const csv = header.join(",") + "\n" + rows.map((r) => r.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  download(blob, "twitch-sorteos-history.csv");
}

function escape(value: string) {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
