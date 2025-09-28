import { create } from 'zustand';
import { PPTIcon, SyllabusIcon, ExerciseIcon, MediaIcon } from '@/components/icons/DashboardIcons';

interface DashboardFeature {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TeachingParams {
  topic: string;
  style?: string;
  chapters?: number;
  duration?: number;
}

interface DashboardStore {
  features: DashboardFeature[];
  teachingParams: TeachingParams;
  setTeachingParams: (params: Partial<TeachingParams>) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  teachingParams: { topic: '' },
  setTeachingParams: (params) => set(state => ({ teachingParams: { ...state.teachingParams, ...params } })),
  features: [
    {
      id: 'ppt',
      title: 'PPT课件生成',
      description: '智能生成可编辑的教学演示文稿',
      path: '/home/dashboard/ppt',
      icon: PPTIcon,
    },
    {
      id: 'syllabus',
      title: '教学大纲制作',
      description: '快速生成结构化课程大纲',
      path: '/home/dashboard/syllabus',
      icon: SyllabusIcon,
    },
    {
      id: 'exercises',
      title: '智能习题推荐',
      description: '基于知识点推荐分层练习题',
      path: '/home/dashboard/exercise',
      icon: ExerciseIcon,
    },
    {
      id: 'media',
      title: '多媒体资源生成',
      description: '自动生成配套教学视频/图示',
      path: '/home/dashboard/media',
      icon: MediaIcon,
    },
  ],
}));