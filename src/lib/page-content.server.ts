import { prisma, parseJson } from "@/lib/prisma";
import {
  DEFAULT_HOME_CONTENT,
  HomeContent,
  mergeHomeContent,
  StudioContent,
  mergeStudioContent,
  ServicesContent,
  mergeServicesContent,
  ContactContent,
  mergeContactContent,
} from "@/lib/page-content";

async function getPageContent<T>(
  pageKey: string,
  merge: (stored: Partial<T> | null | undefined) => T
): Promise<T> {
  const row = await prisma.pageContent.findUnique({ where: { pageKey } });
  const stored = parseJson<Partial<T>>(row?.sections, {});
  return merge(stored);
}

export async function getHomeContent(): Promise<HomeContent> {
  return getPageContent("homepage", mergeHomeContent);
}

export async function getHomeContentForAdmin(): Promise<HomeContent> {
  return getHomeContent();
}

export async function getStudioContent(): Promise<StudioContent> {
  return getPageContent("studio", mergeStudioContent);
}

export async function getServicesContent(): Promise<ServicesContent> {
  return getPageContent("services", mergeServicesContent);
}

export async function getContactContent(): Promise<ContactContent> {
  const row = await prisma.pageContent.findUnique({ where: { pageKey: "contact" } });
  const stored = parseJson<Partial<ContactContent>>(row?.sections, {});
  return mergeContactContent(stored);
}

export { DEFAULT_HOME_CONTENT };
