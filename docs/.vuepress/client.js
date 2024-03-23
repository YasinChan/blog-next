import { defineClientConfig } from 'vuepress/client';
import Post from './layouts/Post.vue';
import Tags from './layouts/Tags.vue';
import Archives from './layouts/Archives.vue';

export default defineClientConfig({
  // we provide some blog layouts
  layouts: {
    Post,
    Tags,
    Archives,
  },
});
