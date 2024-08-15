type GetListItemProps = {
  type: "talk";
  limit?: number;
  tag?: string;
};

type queryOptions = {
  orderings?: {
    field: string,
    direction: string
  },

  limit?: number,
  filters?: any
}

export const useGetListItems = async ({ type, limit, tag }: GetListItemProps) => {
  const prismic = usePrismic();

  const queryOptions: queryOptions = {}

  queryOptions.orderings = {
    field: `my.${type}.date`,
    direction: 'desc',
  }

  if (limit) {
    queryOptions.limit = limit
  }

  if (tag) {
    queryOptions.filters = [
      prismic.filter.at('document.tags', ["tim"])
    ]
  }

  // @ts-ignore
  const data = await prismic.client.getAllByType(type, queryOptions)

  return data
}