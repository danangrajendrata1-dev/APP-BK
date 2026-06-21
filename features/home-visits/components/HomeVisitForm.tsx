"use client";

import { useActionState, useEffect, useState } from "react";

import { ClassSearchSelect } from "@/components/shared/ClassSearchSelect";
import {
  StudentSearchSelect,
  type StudentSearchOption,
} from "@/components/shared/StudentSearchSelect";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { logSupabaseError } from "@/lib/supabase/error";
import { INITIAL_HOME_VISIT_FORM_STATE } from "@/features/home-visits/schemas/homeVisitSchema";
import type { HomeVisitFormState } from "@/features/home-visits/types/homeVisit";

type Props = {
  action: (
    state: HomeVisitFormState,
    formData: FormData,
  ) => Promise<HomeVisitFormState>;
};

type HomeVisitStudentDetails = StudentSearchOption & {
  address: string;
  parentName: string;
};

type HomeVisitFormFieldsProps = {
  formAction: (
    formData: FormData,
  ) => void;
  isPending: boolean;
  state: HomeVisitFormState;
};

function HomeVisitFormFields({
  formAction,
  isPending,
  state,
}: HomeVisitFormFieldsProps) {
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [selectedClass, setSelectedClass] = useState(state.values.className ?? "");
  const [selectedStudent, setSelectedStudent] = useState<StudentSearchOption | null>(
    state.values.studentId
      ? {
          id: state.values.studentId,
          fullName: state.values.studentName,
          nis: "",
          className: state.values.className,
        }
      : null,
  );
  const [studentDetails, setStudentDetails] = useState<HomeVisitStudentDetails | null>(
    state.values.studentId
      ? {
          id: state.values.studentId,
          fullName: state.values.studentName,
          nis: "",
          className: state.values.className,
          parentName: state.values.parentName,
          address: state.values.address,
        }
      : null,
  );
  const [classSearchKey, setClassSearchKey] = useState(0);
  const [studentSearchKey, setStudentSearchKey] = useState(0);
  const studentName = selectedStudent?.fullName ?? "";
  const className = selectedStudent?.className ?? selectedClass;
  const parentName =
    selectedStudent?.id === studentDetails?.id ? (studentDetails?.parentName ?? "") : "";
  const address =
    selectedStudent?.id === studentDetails?.id ? (studentDetails?.address ?? "") : "";

  useEffect(() => {
    const selectedStudentId = selectedStudent?.id;

    if (!selectedStudentId) {
      return;
    }
    const studentId = selectedStudentId;

    let isCancelled = false;

    async function loadStudentDetails() {
      const { data, error } = await supabase
        .from("students")
        .select("id, full_name, nisn, class_name, parent_name, address")
        .eq("id", studentId)
        .maybeSingle();

      if (error) {
        logSupabaseError("[HomeVisitForm] loadStudentDetails", error, {
          studentId,
        });
      }

      if (isCancelled || error || !data) {
        return;
      }

      setStudentDetails({
        id: data.id,
        fullName: data.full_name,
        nis: data.nisn,
        className: data.class_name,
        parentName: data.parent_name ?? "",
        address: data.address ?? "",
      });
    }

    void loadStudentDetails();

    return () => {
      isCancelled = true;
    };
  }, [selectedStudent?.id, supabase]);

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.message}
        </div>
      ) : null}
      <div className="grid gap-5 md:grid-cols-2">
        <Input type="date" name="visitDate" label="Tanggal" defaultValue={state.values.visitDate} error={state.errors.visitDate} />
        <StudentSearchSelect
          key={`student-search-${studentSearchKey}`}
          label="Nama Siswa"
          selectedClass={selectedClass}
          value={selectedStudent}
          error={state.errors.studentId}
          hint={
            selectedClass
              ? "Pencarian siswa dibatasi ke kelas yang dipilih."
              : "Cari siswa langsung, atau pilih kelas dulu untuk mempersempit hasil."
          }
          onSelectStudent={(student) => {
            setSelectedStudent(student);
            setStudentDetails(null);
            if (student) {
              setSelectedClass(student.className);
              setClassSearchKey((currentValue) => currentValue + 1);
            }
          }}
        />
        <ClassSearchSelect
          key={`class-search-${classSearchKey}`}
          label="Kelas"
          value={className}
          error={state.errors.className}
          hint={
            selectedStudent
              ? "Kelas mengikuti siswa yang dipilih. Mengubah kelas akan mengosongkan siswa bila tidak sesuai."
              : "Cari kelas minimal 1 karakter untuk mempersempit pencarian siswa."
          }
          onSelectClass={(nextClass) => {
            setSelectedClass(nextClass);
            if (selectedStudent && selectedStudent.className !== nextClass) {
              setSelectedStudent(null);
              setStudentDetails(null);
              setStudentSearchKey((currentValue) => currentValue + 1);
            }
          }}
        />
        <Input name="parentNameDisplay" label="Nama Orang Tua/Wali" value={parentName} readOnly />
        <div className="md:col-span-2">
          <Textarea name="addressDisplay" label="Alamat" value={address} readOnly rows={3} />
        </div>
        <div className="md:col-span-2">
          <Textarea name="visitResult" label="Hasil Kunjungan" defaultValue={state.values.visitResult} error={state.errors.visitResult} rows={4} />
        </div>
        <div className="md:col-span-2">
          <Textarea name="followUp" label="Tindak Lanjut" defaultValue={state.values.followUp} error={state.errors.followUp} rows={4} />
        </div>
        <Input type="file" name="documentation" label="Dokumentasi" error={state.errors.documentation} accept=".jpg,.jpeg,.png,.webp,.pdf" />
      </div>
      <input type="hidden" name="studentId" value={selectedStudent?.id ?? ""} />
      <input type="hidden" name="studentName" value={studentName} />
      <input type="hidden" name="parentName" value={parentName} />
      <input type="hidden" name="className" value={className} />
      <input type="hidden" name="address" value={address} />
      <div className="flex justify-end">
        <Button type="submit" isLoading={isPending}>Simpan Home Visit</Button>
      </div>
    </form>
  );
}

export function HomeVisitForm({ action }: Props) {
  const [state, formAction, isPending] = useActionState(action, {
    ...INITIAL_HOME_VISIT_FORM_STATE,
  });
  const formStateKey = [
    state.values.visitDate,
    state.values.studentId,
    state.values.studentName,
    state.values.parentName,
    state.values.className,
    state.values.address,
    state.values.visitResult,
    state.values.followUp,
    state.message,
  ].join("|");

  return (
    <HomeVisitFormFields
      key={formStateKey}
      formAction={formAction}
      isPending={isPending}
      state={state}
    />
  );
}
