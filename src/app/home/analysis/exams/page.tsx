"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card_Upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Exam, getAllExams } from "@/lib/api/exam";

export default function ExamsDirectoryPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  useEffect(() => {
    let cancelled = false;
    const fetchExams = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getAllExams();
        if (cancelled) return;
        if (response.data.code === "200") {
          setExams(response.data.data || []);
        } else {
          setError("获取考试列表失败");
        }
      } catch (err) {
        if (!cancelled) {
          console.error("获取考试列表失败", err);
          setError("获取考试列表失败");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchExams();
    return () => {
      cancelled = true;
    };
  }, []);

  const subjectOptions = useMemo(() => {
    const set = new Set<string>();
    exams.forEach((exam) => {
      if (exam.examSubject) {
        set.add(exam.examSubject);
      }
    });
    return Array.from(set);
  }, [exams]);

  const yearOptions = useMemo(() => {
    const set = new Set<string>();
    exams.forEach((exam) => {
      const year = dayjs(exam.examDate).format("YYYY");
      set.add(year);
    });
    return Array.from(set).sort().reverse();
  }, [exams]);

  const filteredExams = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return exams
      .filter((exam) => {
        const matchesKeyword = keyword
          ? exam.examName.toLowerCase().includes(keyword)
          : true;
        const matchesSubject = subjectFilter
          ? exam.examSubject === subjectFilter
          : true;
        const matchesYear = yearFilter
          ? dayjs(exam.examDate).format("YYYY") === yearFilter
          : true;
        return matchesKeyword && matchesSubject && matchesYear;
      })
      .sort(
        (a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime()
      );
  }, [exams, search, subjectFilter, yearFilter]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">学情分析</p>
          <h1 className="text-3xl font-semibold text-gray-900">考试全览</h1>
          <p className="text-sm text-gray-500">
            快速浏览全部考试批次，支持按科目和年份筛选。
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
              <Label htmlFor="exam-search">考试名称</Label>
              <Input
                id="exam-search"
                placeholder="输入关键字"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject-filter">科目</Label>
              <select
                id="subject-filter"
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                value={subjectFilter}
                onChange={(event) => setSubjectFilter(event.target.value)}
              >
                <option value="">全部科目</option>
                {subjectOptions.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year-filter">年份</Label>
              <select
                id="year-filter"
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                value={yearFilter}
                onChange={(event) => setYearFilter(event.target.value)}
              >
                <option value="">全部年份</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
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
            <CardTitle className="text-lg">考试批次列表</CardTitle>
            <p className="text-sm text-gray-500">{filteredExams.length} 场考试</p>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3">考试名称</th>
                  <th className="px-4 py-3">科目</th>
                  <th className="px-4 py-3">考试日期</th>
                  <th className="px-4 py-3">附件</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-gray-500" colSpan={4}>
                      正在加载考试数据...
                    </td>
                  </tr>
                ) : !filteredExams.length ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-gray-500" colSpan={4}>
                      暂无符合条件的考试
                    </td>
                  </tr>
                ) : (
                  filteredExams.map((exam) => (
                    <tr key={exam.examId} className="hover:bg-gray-50/80">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {exam.examName}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{exam.examSubject}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {dayjs(exam.examDate).format("YYYY年MM月DD日")}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {exam.filePath ? (
                          <Link
                            href={exam.filePath}
                            target="_blank"
                            className="text-blue-600 underline-offset-2 hover:underline"
                          >
                            查看附件
                          </Link>
                        ) : (
                          <span className="text-gray-400">暂无</span>
                        )}
                      </td>
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
