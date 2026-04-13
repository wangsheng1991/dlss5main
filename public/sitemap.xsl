<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" indent="yes" encoding="UTF-8"/>

  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap — DLSS 5 NVIDIA</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #09090b; color: #e4e4e7; margin: 0; padding: 40px 20px; }
          h1 { color: #17ff89; font-size: 28px; margin-bottom: 8px; }
          p { color: #71717a; margin: 0 0 24px; }
          table { border-collapse: collapse; width: 100%; max-width: 900px; background: #18181b; border-radius: 12px; overflow: hidden; }
          th { background: #27272a; color: #17ff89; text-align: left; padding: 12px 16px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
          td { padding: 12px 16px; border-bottom: 1px solid #27272a; font-size: 14px; }
          tr:last-child td { border-bottom: none; }
          tr:hover td { background: #3f3f46; }
          a { color: #e4e4e7; text-decoration: none; }
          a:hover { color: #17ff89; }
          .priority-high { color: #17ff89; }
          .priority-mid { color: #a1a1aa; }
          .priority-low { color: #52525b; }
          .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
          .badge-high { background: rgba(23,255,137,0.15); color: #17ff89; }
          .badge-mid { background: rgba(161,161,170,0.15); color: #a1a1aa; }
          .badge-low { background: rgba(82,82,91,0.3); color: #52525b; }
        </style>
      </head>
      <body>
        <h1>DLSS 5 — Sitemap</h1>
        <p>DLSS 5 NVIDIA AI Image Upscaling &amp; Neural Super-Resolution. All pages indexed for search engines.</p>
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Last Modified</th>
              <th>Change Freq</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <tr>
                <td>
                  <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                </td>
                <td><xsl:value-of select="sitemap:lastmod"/></td>
                <td><xsl:value-of select="sitemap:changefreq"/></td>
                <td>
                  <xsl:choose>
                    <xsl:when test="sitemap:priority >= 0.9">
                      <span class="badge badge-high">HIGH <xsl:value-of select="sitemap:priority"/></span>
                    </xsl:when>
                    <xsl:when test="sitemap:priority >= 0.6">
                      <span class="badge badge-mid">MED <xsl:value-of select="sitemap:priority"/></span>
                    </xsl:when>
                    <xsl:otherwise>
                      <span class="badge badge-low">LOW <xsl:value-of select="sitemap:priority"/></span>
                    </xsl:otherwise>
                  </xsl:choose>
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
