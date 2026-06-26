/** Strip Prisma Date fields before passing models to client components. */
export function serializeProjectForClient<
  T extends {
    createdAt?: Date;
    updatedAt?: Date;
  },
>(project: T): Omit<T, "createdAt" | "updatedAt"> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { createdAt, updatedAt, ...rest } = project;
  return rest;
}

export function serializeProjectsForClient<
  T extends { createdAt?: Date; updatedAt?: Date },
>(projects: T[]): Omit<T, "createdAt" | "updatedAt">[] {
  return projects.map(serializeProjectForClient);
}

export function serializeProductForClient<
  T extends {
    createdAt?: Date;
    updatedAt?: Date;
  },
>(product: T): Omit<T, "createdAt" | "updatedAt"> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { createdAt, updatedAt, ...rest } = product;
  return rest;
}

export function serializeProductsForClient<
  T extends { createdAt?: Date; updatedAt?: Date },
>(products: T[]): Omit<T, "createdAt" | "updatedAt">[] {
  return products.map(serializeProductForClient);
}
