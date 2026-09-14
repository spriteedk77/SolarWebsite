import { definePlugin } from 'sanity';
import { SiteInfoTool } from './SiteInfoTool';

/**
 * Registers the short form as the admin's first screen.
 *
 * A Studio tool rather than a page of our own on purpose. A form that can
 * change the company's phone number has to know who is asking, and a tool is
 * already inside the editor's signed-in session: no token in this application,
 * no endpoint of our own to protect, and Sanity's own permissions decide what
 * each person may write. Building that ourselves would mean building a login.
 */
export const siteInfoTool = definePlugin({
  name: 'np88-site-info',
  tools: [
    {
      name: 'site-info',
      title: 'ข้อมูลเว็บไซต์',
      component: SiteInfoTool,
    },
  ],
});
