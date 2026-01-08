import { createClient } from 'contentful';

const client = createClient({
  space: 'navontrqk0l3',
  accessToken: '83Q5hThGBPCIgXAYX7Fc-gSUN-psxg_j-F-gXSskQBc'
});

client.getContentTypes()
  .then((response) => {
    console.log('Content Types:');
    response.items.forEach((type) => {
      console.log(`- Name: ${type.name}, ID: ${type.sys.id}`);
      type.fields.forEach(field => {
        console.log(`  - Field: ${field.name} (id: ${field.id}, type: ${field.type})`);
      });
    });
  })
  .catch(console.error);
