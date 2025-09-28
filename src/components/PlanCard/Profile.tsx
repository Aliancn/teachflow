"use client";
import { BookOpenText, GraduationCap, LibraryBig } from "lucide-react";

interface ProfileCardProps {
  topic: string;
  className?: string;
  subject: string;
  grade: string;
}

export function ProfileCard({ topic, className, subject, grade }: ProfileCardProps) {
  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}>
      <div className="flex justify-between items-start">
        {/* 教学主题 */}
        <div className="text-center w-1/3 px-2">
          <BookOpenText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <h3 className="text-sm font-medium text-gray-500 mb-1">教学主题</h3>
          <p className="text-lg font-semibold text-gray-900 line-clamp-2">{topic}</p>
        </div>

        {/* 适用班级 */}
        <div className="text-center w-1/3 px-2 border-x">
          <GraduationCap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h3 className="text-sm font-medium text-gray-500 mb-1">适用班级</h3>
          <p className="text-lg font-semibold text-gray-900">{grade}</p>
        </div>

        {/* 所属学科 */}
        <div className="text-center w-1/3 px-2">
          <LibraryBig className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <h3 className="text-sm font-medium text-gray-500 mb-1">所属学科</h3>
          <p className="text-lg font-semibold text-gray-900">{subject}</p>
        </div>
      </div>
    </div>
  );
}