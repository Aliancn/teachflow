"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card_Upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getStudentsByTeacherId, StudentResponse } from "@/lib/api/student";
import { useAuthStore } from "@/lib/stores/authStore";

export default function StudentsDirectoryPage() {
  const { user } = useAuthStore();
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");

  useEffect(() => {
    if (!user?.id) {
      setStudents([]);
      return;
    }

    let cancelled = false;
    const fetchStudents = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getStudentsByTeacherId(user.id);
        if (cancelled) return;
        if (response.data.code === "200") {
          setStudents(response.data.data || []);
        } else {
          setError("获取学生列表失败");
        }
      } catch (err) {
        if (!cancelled) {
          console.error("获取学生列表失败", err);
          setError("获取学生列表失败");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchStudents();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const gradeOptions = useMemo(() => {
    const set = new Set<string>();
    students.forEach((student) => {
      if (student.grade) {
        set.add(student.grade);
      }
    });
    return Array.from(set);
  }, [students]);

  const classOptions = useMemo(() => {
    const set = new Set<string>();
    students.forEach((student) => {
      if (student.clazz) {
        set.add(student.clazz);
      }
    });
    return Array.from(set);
  }, [students]);

  const filteredStudents = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return students.filter((student) => {
      const matchesKeyword = keyword
        ? student.studentName.toLowerCase().includes(keyword) ||
          student.studentNumber.toLowerCase().includes(keyword)
        : true;
      const matchesGrade = gradeFilter ? student.grade === gradeFilter : true;
      const matchesClass = classFilter ? student.clazz === classFilter : true;
      return matchesKeyword && matchesGrade && matchesClass;
    });
  }, [students, search, gradeFilter, classFilter]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">学情分析</p>
          <h1 className="text-3xl font-semibold text-gray-900">学生全览</h1>
          <p className="text-sm text-gray-500">
            浏览全部学生，并按年级或班级快速筛选。
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/home/analysis"
            className="inline-flex h-10 items-center justify-center rounded-md border border-purple-200 px-4 text-sm font-medium text-purple-700 transition hover:bg-purple-50"
          >
            返回分析
          </Link>
          <Button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            回到顶部
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">筛选条件</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="student-search">姓名 / 学号</Label>
              <Input
                id="student-search"
                placeholder="输入关键字"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade-filter">年级</Label>
              <select
                id="grade-filter"
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                value={gradeFilter}
                onChange={(event) => setGradeFilter(event.target.value)}
              >
                <option value="">全部年级</option>
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="class-filter">班级</Label>
              <select
                id="class-filter"
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                value={classFilter}
                onChange={(event) => setClassFilter(event.target.value)}
              >
                <option value="">全部班级</option>
                {classOptions.map((clazz) => (
                  <option key={clazz} value={clazz}>
                    {clazz}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-2 pb-4 md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle className="text-lg">学生列表</CardTitle>
            <p className="text-sm text-gray-500">{filteredStudents.length} 位学生</p>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3">姓名</th>
                  <th className="px-4 py-3">学号</th>
                  <th className="px-4 py-3">年级</th>
                  <th className="px-4 py-3">班级</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-gray-500" colSpan={4}>
                      正在加载学生数据...
                    </td>
                  </tr>
                ) : !filteredStudents.length ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-gray-500" colSpan={4}>
                      暂无符合条件的学生
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50/80">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {student.studentName}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{student.studentNumber}</td>
                      <td className="px-4 py-3 text-gray-600">{student.grade || "-"}</td>
                      <td className="px-4 py-3 text-gray-600">{student.clazz || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
