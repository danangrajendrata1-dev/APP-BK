export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: "admin" | "guru_bk" | "siswa";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: "admin" | "guru_bk" | "siswa";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          role?: "admin" | "guru_bk" | "siswa";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      students: {
        Row: {
          id: string;
          nisn: string;
          full_name: string;
          gender: string;
          class_name: string;
          major: string;
          birth_place_date: string | null;
          address: string | null;
          phone: string | null;
          parent_name: string | null;
          parent_phone: string | null;
          status: "Aktif" | "Lulus" | "Pindah" | "Off";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nisn: string;
          full_name: string;
          gender: string;
          class_name: string;
          major: string;
          birth_place_date?: string | null;
          address?: string | null;
          phone?: string | null;
          parent_name?: string | null;
          parent_phone?: string | null;
          status?: "Aktif" | "Lulus" | "Pindah" | "Off";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nisn?: string;
          full_name?: string;
          gender?: string;
          class_name?: string;
          major?: string;
          birth_place_date?: string | null;
          address?: string | null;
          phone?: string | null;
          parent_name?: string | null;
          parent_phone?: string | null;
          status?: "Aktif" | "Lulus" | "Pindah" | "Off";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      school_attendance: {
        Row: {
          id: string;
          attendance_date: string;
          student_id: string | null;
          student_name: string;
          class_name: string;
          status: "Hadir" | "Izin" | "Sakit" | "Alfa" | "Terlambat";
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          attendance_date: string;
          student_id?: string | null;
          student_name: string;
          class_name: string;
          status: "Hadir" | "Izin" | "Sakit" | "Alfa" | "Terlambat";
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          attendance_date?: string;
          student_id?: string | null;
          student_name?: string;
          class_name?: string;
          status?: "Hadir" | "Izin" | "Sakit" | "Alfa" | "Terlambat";
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      bk_service_attendance: {
        Row: {
          id: string;
          service_date: string;
          student_id: string | null;
          student_name: string;
          class_name: string;
          arrival_time: string | null;
          finish_time: string | null;
          purpose:
            | "Konseling Individu"
            | "Konseling Kelompok"
            | "Layanan Klasikal"
            | "Informasi Karier"
            | "Informasi Sekolah Lanjutan"
            | "Pemanggilan"
            | "Lainnya";
          service_type:
            | "Layanan Dasar"
            | "Layanan Responsif"
            | "Layanan Perencanaan Individual"
            | "Layanan Dukungan Sistem";
          counselor_name: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          service_date: string;
          student_id?: string | null;
          student_name: string;
          class_name: string;
          arrival_time?: string | null;
          finish_time?: string | null;
          purpose:
            | "Konseling Individu"
            | "Konseling Kelompok"
            | "Layanan Klasikal"
            | "Informasi Karier"
            | "Informasi Sekolah Lanjutan"
            | "Pemanggilan"
            | "Lainnya";
          service_type:
            | "Layanan Dasar"
            | "Layanan Responsif"
            | "Layanan Perencanaan Individual"
            | "Layanan Dukungan Sistem";
          counselor_name?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          service_date?: string;
          student_id?: string | null;
          student_name?: string;
          class_name?: string;
          arrival_time?: string | null;
          finish_time?: string | null;
          purpose?:
            | "Konseling Individu"
            | "Konseling Kelompok"
            | "Layanan Klasikal"
            | "Informasi Karier"
            | "Informasi Sekolah Lanjutan"
            | "Pemanggilan"
            | "Lainnya";
          service_type?:
            | "Layanan Dasar"
            | "Layanan Responsif"
            | "Layanan Perencanaan Individual"
            | "Layanan Dukungan Sistem";
          counselor_name?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      counseling_records: {
        Row: {
          id: string;
          counseling_date: string;
          student_id: string | null;
          student_name: string;
          class_name: string;
          meeting_number: number | null;
          media: "Offline" | "Online";
          counseling_type: "Individu" | "Kelompok";
          topic: string | null;
          counseling_result: string | null;
          follow_up: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          counseling_date: string;
          student_id?: string | null;
          student_name: string;
          class_name: string;
          meeting_number?: number | null;
          media: "Offline" | "Online";
          counseling_type: "Individu" | "Kelompok";
          topic?: string | null;
          counseling_result?: string | null;
          follow_up?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          counseling_date?: string;
          student_id?: string | null;
          student_name?: string;
          class_name?: string;
          meeting_number?: number | null;
          media?: "Offline" | "Online";
          counseling_type?: "Individu" | "Kelompok";
          topic?: string | null;
          counseling_result?: string | null;
          follow_up?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      student_assistances: {
        Row: {
          id: string;
          assistance_month: number;
          assistance_year: number;
          student_id: string | null;
          student_name: string;
          class_name: string;
          day_1: string | null;
          day_2: string | null;
          day_3: string | null;
          day_4: string | null;
          day_5: string | null;
          day_6: string | null;
          day_7: string | null;
          day_8: string | null;
          day_9: string | null;
          day_10: string | null;
          day_11: string | null;
          day_12: string | null;
          day_13: string | null;
          day_14: string | null;
          day_15: string | null;
          day_16: string | null;
          day_17: string | null;
          day_18: string | null;
          day_19: string | null;
          day_20: string | null;
          day_21: string | null;
          day_22: string | null;
          day_23: string | null;
          day_24: string | null;
          day_25: string | null;
          day_26: string | null;
          day_27: string | null;
          day_28: string | null;
          day_29: string | null;
          day_30: string | null;
          day_31: string | null;
          total: number;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          assistance_month: number;
          assistance_year: number;
          student_id?: string | null;
          student_name: string;
          class_name: string;
          day_1?: string | null;
          day_2?: string | null;
          day_3?: string | null;
          day_4?: string | null;
          day_5?: string | null;
          day_6?: string | null;
          day_7?: string | null;
          day_8?: string | null;
          day_9?: string | null;
          day_10?: string | null;
          day_11?: string | null;
          day_12?: string | null;
          day_13?: string | null;
          day_14?: string | null;
          day_15?: string | null;
          day_16?: string | null;
          day_17?: string | null;
          day_18?: string | null;
          day_19?: string | null;
          day_20?: string | null;
          day_21?: string | null;
          day_22?: string | null;
          day_23?: string | null;
          day_24?: string | null;
          day_25?: string | null;
          day_26?: string | null;
          day_27?: string | null;
          day_28?: string | null;
          day_29?: string | null;
          day_30?: string | null;
          day_31?: string | null;
          total?: number;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          assistance_month?: number;
          assistance_year?: number;
          student_id?: string | null;
          student_name?: string;
          class_name?: string;
          day_1?: string | null;
          day_2?: string | null;
          day_3?: string | null;
          day_4?: string | null;
          day_5?: string | null;
          day_6?: string | null;
          day_7?: string | null;
          day_8?: string | null;
          day_9?: string | null;
          day_10?: string | null;
          day_11?: string | null;
          day_12?: string | null;
          day_13?: string | null;
          day_14?: string | null;
          day_15?: string | null;
          day_16?: string | null;
          day_17?: string | null;
          day_18?: string | null;
          day_19?: string | null;
          day_20?: string | null;
          day_21?: string | null;
          day_22?: string | null;
          day_23?: string | null;
          day_24?: string | null;
          day_25?: string | null;
          day_26?: string | null;
          day_27?: string | null;
          day_28?: string | null;
          day_29?: string | null;
          day_30?: string | null;
          day_31?: string | null;
          total?: number;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      class_assistances: {
        Row: {
          id: string;
          student_id: string | null;
          student_name: string;
          class_name: string;
          violation_type: string | null;
          action_form: string | null;
          remission: string | null;
          description: string | null;
          final_warning_letter: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id?: string | null;
          student_name: string;
          class_name: string;
          violation_type?: string | null;
          action_form?: string | null;
          remission?: string | null;
          description?: string | null;
          final_warning_letter?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string | null;
          student_name?: string;
          class_name?: string;
          violation_type?: string | null;
          action_form?: string | null;
          remission?: string | null;
          description?: string | null;
          final_warning_letter?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          letter_number: string;
          document_date: string;
          student_id: string | null;
          student_name: string;
          class_name: string | null;
          document_type:
            | "Surat Panggilan Orang Tua"
            | "Surat Home Visit"
            | "Surat Kontrak Perilaku Siswa"
            | "Surat Pernyataan Siswa"
            | "Surat Peringatan 1"
            | "Surat Peringatan 2"
            | "Surat Peringatan 3"
            | "Berita Acara Panggilan Orang Tua"
            | "Contoh Surat Pengunduran Diri";
          file_url: string | null;
          file_path: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          letter_number: string;
          document_date: string;
          student_id?: string | null;
          student_name: string;
          class_name?: string | null;
          document_type:
            | "Surat Panggilan Orang Tua"
            | "Surat Home Visit"
            | "Surat Kontrak Perilaku Siswa"
            | "Surat Pernyataan Siswa"
            | "Surat Peringatan 1"
            | "Surat Peringatan 2"
            | "Surat Peringatan 3"
            | "Berita Acara Panggilan Orang Tua"
            | "Contoh Surat Pengunduran Diri";
          file_url?: string | null;
          file_path?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          letter_number?: string;
          document_date?: string;
          student_id?: string | null;
          student_name?: string;
          class_name?: string | null;
          document_type?:
            | "Surat Panggilan Orang Tua"
            | "Surat Home Visit"
            | "Surat Kontrak Perilaku Siswa"
            | "Surat Pernyataan Siswa"
            | "Surat Peringatan 1"
            | "Surat Peringatan 2"
            | "Surat Peringatan 3"
            | "Berita Acara Panggilan Orang Tua"
            | "Contoh Surat Pengunduran Diri";
          file_url?: string | null;
          file_path?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      home_visits: {
        Row: {
          id: string;
          visit_date: string;
          student_id: string | null;
          student_name: string;
          parent_name: string | null;
          class_name: string;
          address: string | null;
          visit_result: string | null;
          follow_up: string | null;
          documentation_url: string | null;
          documentation_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          visit_date: string;
          student_id?: string | null;
          student_name: string;
          parent_name?: string | null;
          class_name: string;
          address?: string | null;
          visit_result?: string | null;
          follow_up?: string | null;
          documentation_url?: string | null;
          documentation_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          visit_date?: string;
          student_id?: string | null;
          student_name?: string;
          parent_name?: string | null;
          class_name?: string;
          address?: string | null;
          visit_result?: string | null;
          follow_up?: string | null;
          documentation_url?: string | null;
          documentation_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      confession_box: {
        Row: {
          id: string;
          confession_date: string;
          student_id: string | null;
          student_name: string | null;
          class_name: string | null;
          category:
            | "Pribadi"
            | "Sosial"
            | "Belajar"
            | "Karier"
            | "Keluarga"
            | "Lainnya";
          content: string;
          description: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          confession_date?: string;
          student_id?: string | null;
          student_name?: string | null;
          class_name?: string | null;
          category:
            | "Pribadi"
            | "Sosial"
            | "Belajar"
            | "Karier"
            | "Keluarga"
            | "Lainnya";
          content: string;
          description?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          confession_date?: string;
          student_id?: string | null;
          student_name?: string | null;
          class_name?: string | null;
          category?:
            | "Pribadi"
            | "Sosial"
            | "Belajar"
            | "Karier"
            | "Keluarga"
            | "Lainnya";
          content?: string;
          description?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      assessment_files: {
        Row: {
          id: string;
          title: string;
          assessment_type:
            | "Angket Kebutuhan Siswa"
            | "Inventori Tugas Perkembangan"
            | "Angket Minat Karier"
            | "Angket Gaya Belajar"
            | "Daftar Cek Masalah (DCM)"
            | "Sosiometri";
          file_url: string | null;
          file_path: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          assessment_type:
            | "Angket Kebutuhan Siswa"
            | "Inventori Tugas Perkembangan"
            | "Angket Minat Karier"
            | "Angket Gaya Belajar"
            | "Daftar Cek Masalah (DCM)"
            | "Sosiometri";
          file_url?: string | null;
          file_path?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          assessment_type?:
            | "Angket Kebutuhan Siswa"
            | "Inventori Tugas Perkembangan"
            | "Angket Minat Karier"
            | "Angket Gaya Belajar"
            | "Daftar Cek Masalah (DCM)"
            | "Sosiometri";
          file_url?: string | null;
          file_path?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      v_student_class_options: {
        Row: {
          class_name: string;
        };
      };
      v_student_count_by_class: {
        Row: {
          class_name: string;
          total_students: number;
        };
      };
      v_students_with_relations: {
        Row: {
          id: string;
          nisn: string;
          full_name: string;
          gender: string;
          class_name: string;
          major: string;
          major_code: string;
          birth_place_date: string | null;
          address: string | null;
          phone: string | null;
          parent_name: string | null;
          parent_phone: string | null;
          status: "Aktif" | "Lulus" | "Pindah" | "Off";
          created_at: string;
          updated_at: string;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
