/**
 * CAREERforge AI — Standalone 1-Click ZIP Exporter
 * Uses JSZip and FileSaver to bundle the production static website package.
 */

class ZipExporter {
  constructor() {}

  /**
   * Bundles and triggers download of the standalone static site package.
   */
  async exportPortfolio(profile, options = {}) {
    if (!window.JSZip || !window.saveAs) {
      alert("ZIP generation library loading. Please try again in 2 seconds.");
      return;
    }

    const zip = new JSZip();
    const htmlContent = window.portfolioEngine.generateHTML(profile, options);

    const readmeContent = `# ${profile.name} — Personal Portfolio Website

This package contains your self-contained, production-ready personal portfolio website generated with **CAREERforge AI**.

## 🚀 1-Minute 100% Free Deployment Options

### Option 1: Netlify Drop (Easiest — Zero Setup)
1. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)** in your browser.
2. Drag and drop this unzipped folder into the box.
3. Your website is instantly live on a free HTTPS URL (e.g., \`https://${profile.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.netlify.app\`).

### Option 2: GitHub Pages (Best for Engineers)
1. Create a repository on GitHub named \`your-username.github.io\`.
2. Commit and push the \`index.html\` file to the \`main\` branch.
3. Your portfolio will be live at \`https://your-username.github.io\`.

### Option 3: Vercel
1. Install Vercel CLI (\`npm i -g vercel\`) or import your GitHub repository at **[vercel.com](https://vercel.com)**.
2. Click **Deploy**.

---
*Built with ❤️ by CAREERforge AI.*
`;

    // Add files to the ZIP
    zip.file("index.html", htmlContent);
    zip.file("README.md", readmeContent);

    const safeName = (profile.name || "portfolio").toLowerCase().replace(/[^a-z0-9]/g, '-');
    const zipBlob = await zip.generateAsync({ type: "blob" });
    
    window.saveAs(zipBlob, `${safeName}-portfolio.zip`);

    // Trigger celebratory confetti
    if (window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }
}

window.zipExporter = new ZipExporter();
