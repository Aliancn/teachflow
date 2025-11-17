import { ResponseBody, instance } from "./instance"

export interface Exam {
    examId: number;
    examName: string;
    examSubject: string;
    examDate: string;
    filePath: string;
}

export const uploadExam = (data: { examName: string; examSubject: string; examDate: string; file: File }) => {
    const formData = new FormData();
    formData.append('examName', data.examName);
    formData.append('examSubject', data.examSubject);
    formData.append('examDate', data.examDate);
    formData.append('file', data.file);

    return instance.post<
        ResponseBody<{
            examId: number;
        }>
    >('/exams', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const getAllExams = () =>
    instance.get<
        ResponseBody<Exam[]>
    >('/exams');