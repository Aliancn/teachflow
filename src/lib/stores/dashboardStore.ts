import { create } from 'zustand';
import { PPTIcon, SyllabusIcon, ExerciseIcon, MediaIcon , FileTextIcon, BookIcon, StarIcon} from '@/components/icons/DashboardIcons';

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
    {
      id: 'resource-search',
      title: '资源搜索',
      description: '快速查找教学资源',
      path: '/home/dashboard/resource',
      icon: FileTextIcon,
    },
    {
      id: 'auto-paper',
      title: '一键出卷',
      description: '智能生成考试试卷',
      path: '/home/dashboard/paper',
      icon: BookIcon,
    },
    {
      id: 'exercise-enhance',
      title: '习题强化',
      description: '个性化题目优化',
      path: '/home/dashboard/optimize',
      icon: StarIcon,
    },
  ],
}));