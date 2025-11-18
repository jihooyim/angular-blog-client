export class Blog {
  blogId?: number;
  title?: string;
  htmlContent?: string;
  publishContentKr?: string;
  spellCorrections?: string;
  readCount?: number;
  publishYn?: string;
  formatUpdateDate?: string;
  formatCreateDate?: string;
  formatPublishedDate?: string;
  formatPublishedDateForMenu?: string;
  tags?: string;
}

export class BlogMenu {
  blogId?: number;
  title?: string;
  readCount?: number;
  formatPublishedDateForMenu?: string;
}

export class BlogUserView {
  blogView?: BlogView;
  list?: BlogMenu[];
}

export class BlogView {
  blogId?: number;
  title?: string;
  htmlContent?: string;
  formatUpdateDate?: string;
  formatCreateDate?: string;
  formatPublishedDate?: string;
  tagList?: string[];
}

export class BlogHistory {
  blogHistoryId!: number;
  blogId!: number;
  title?: string;
  htmlContent?: string;
  readCount?: number;
  publishYn?: string;
  formatBlogUpdateDate?: string;
  formatBlogCreateDate?: string;
  formatCreateDate?: string;
  formatPublishedDate?: string;
}

export class BlogTag {
  tagId!: number;
  blogId!: number;
  tagName?: string;
  formatUpdateDate?: string;
  formatCreateDate?: string;
}

export interface BlogsRequestDto {
  startDate?: string;
  endDate?: string;
  searchText?: string;
}

export const RefinedButtonNames = {
  PURIFY: '정제',
  EDIT: '게시글 편집',
} as const;

export type RefinedButtonName =
  (typeof RefinedButtonNames)[keyof typeof RefinedButtonNames];
