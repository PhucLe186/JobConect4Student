import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ApplyJobDocument = job_applications & Document;

@Schema({ collection: 'job_applications', versionKey: false })
export class job_applications {
  @Prop({ type: Types.ObjectId, ref: 'Jobs', required: true })
  job_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  student_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'CV' })
  cv_id?: Types.ObjectId;

  @Prop({ type: String })
  cv_file_path?: string;

  @Prop({ type: String })
  cv_file_base64?: string;

  @Prop({ type: String, required: true })
  full_name: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String })
  cover_letter?: string;

  @Prop({ enum: ['sent', 'viewed', 'rejected', 'accepted'], default: 'sent' })
  status: string;

  @Prop({ type: Date, default: Date.now })
  applied_at: Date;

  // ==========================================
  // CÁC TRƯỜNG BỔ SUNG CHO TÍCH HỢP AI LỌC CV
  // ==========================================

  @Prop({ type: Number, default: 0 })
  match_score: number; // Lưu điểm số phù hợp với JD (Ví dụ: 85)

  @Prop({ type: Object, default: {} })
  ai_extracted_data: Record<string, any>; // Lưu cục dữ liệu JSON ứng viên đã xác nhận trên Form
}

export const jobApplySchema = SchemaFactory.createForClass(job_applications);

// ==========================================
// TỐI ƯU HÓA TỐC ĐỘ CHO TÍNH NĂNG "CV ƯU TÚ"
// ==========================================
// Thêm Compound Index: Giúp MongoDB sắp xếp điểm từ cao xuống thấp cực nhanh 
// khi nhà tuyển dụng mở danh sách ứng viên của một job cụ thể.
jobApplySchema.index({ job_id: 1, match_score: -1 });