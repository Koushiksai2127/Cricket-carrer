/**
 * Mock PocketBase client that talks to our local Express API
 */

const pb = {
  authStore: {
    isValid: true,
    model: { id: 'anonymous', name: 'Guest' },
    clear: () => {},
    onChange: (cb: any) => {
      return () => {};
    }
  },
  collection: (name: string) => ({
    getFullList: async (options: any = {}) => {
      const url = new URL(`${window.location.origin}/api/collections/${name}/records`);
      if (options.filter) url.searchParams.append('filter', options.filter);
      if (options.sort) url.searchParams.append('sort', options.sort);
      
      const res = await fetch(url.toString());
      const data = await res.json();
      
      // Parse JSON fields back
      return (data.items || []).map((item: any) => {
        const newItem = { ...item };
        for (const key in newItem) {
          if (typeof newItem[key] === 'string' && (newItem[key].startsWith('{') || newItem[key].startsWith('['))) {
            try {
              newItem[key] = JSON.parse(newItem[key]);
            } catch (e) {}
          }
        }
        return newItem;
      });
    },
    create: async (data: any) => {
      const res = await fetch(`${window.location.origin}/api/collections/${name}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    authWithPassword: async (e: string, p: string) => {
      return { record: { id: 'anonymous', name: 'Guest' } };
    }
  }),
  resetCareer: async (userId: string) => {
    const res = await fetch(`${window.location.origin}/api/reset-career`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  }
};

export default pb;
