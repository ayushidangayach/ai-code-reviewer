declare namespace chrome {
  namespace storage {
    namespace sync {
      function get(
        keys: string | string[] | object | null,
        callback: (items: { [key: string]: unknown }) => void
      ): void;
      function set(items: object, callback?: () => void): void;
    }
  }
}
