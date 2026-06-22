import { Badge } from "@/components/ui/Badge";
import type { StudentStatus } from "@/types/common";

type StudentStatusBadgeProps = {
  status: StudentStatus;
};

const STATUS_VARIANTS: Record<
  StudentStatus,
  "success" | "info" | "warning" | "danger"
> = {
  Aktif: "success",
  Lulus: "info",
  Pindah: "warning",
  Off: "danger",
};

export function StudentStatusBadge({ status }: StudentStatusBadgeProps) {
  return <Badge variant={STATUS_VARIANTS[status]}>{status}</Badge>;
}
