import { defineClientConfig } from 'vuepress/client';
import Home from './layouts/Home.vue';
import Post from './layouts/Post.vue';
import Tags from './layouts/Tags.vue';
import Archives from './layouts/Archives.vue';
import Explore from './layouts/Explore.vue';
import SpaceBackdrop from './components/SpaceBackdrop.vue';
import './styles/index.scss';
import './styles/explore.scss';

export default defineClientConfig({
  layouts: {
    Home,
    Post,
    Tags,
    Archives,
    Explore,
  },
  rootComponents: [SpaceBackdrop],
});
