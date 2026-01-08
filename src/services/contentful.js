import { createClient } from 'contentful';

const defaultSpaceId = 'navontrqk0l3';
const defaultAccessToken = '83Q5hThGBPCIgXAYX7Fc-gSUN-psxg_j-F-gXSskQBc';

const getClient = () => {
  const spaceId = localStorage.getItem('contentful_space_id') || import.meta.env.VITE_CONTENTFUL_SPACE_ID || defaultSpaceId;
  const accessToken = localStorage.getItem('contentful_access_token') || import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN || defaultAccessToken;

  return createClient({
    space: spaceId,
    accessToken: accessToken
  });
};

export const client = getClient();

export const getContent = async (contentType) => {
  try {
    // Re-create client in case localStorage changed (though typically requires reload)
    // For simplicity we use the exported client which is created on module load.
    // If settings change, we expect a page reload.
    const response = await client.getEntries({
      content_type: contentType
    });
    return response.items;
  } catch (error) {
    console.error(`Error fetching ${contentType}:`, error);
    return [];
  }
};
