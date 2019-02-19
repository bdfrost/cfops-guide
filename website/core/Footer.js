/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl('getting-started')}>
              Getting Started
            </a>
            <a href={this.docUrl('concourse-deploying-concourse')}>
              Concourse
            </a>
          </div>
          <div>
            <h5>Community</h5>
            <a
              href="https://twitter.com/mimacom"
              target="_blank"
              rel="noreferrer noopener">
              Twitter
            </a>
          </div>
          <div>
            <h5>More</h5>
            <a href="https://blog.mimacom.com/tag/cloud-foundry" target="_blank">Blog</a>
            <a href="https://github.com/mimacom" target="_blank">GitHub</a>
            <a href="https://gitlab.com/mimacom/cloud" target="_blank">GitLab</a>
          </div>
          <div>
            <h5>Imprint &amp; Privacy</h5>
            <a href="https://www.mimacom.com/en/imprint/" target="_blank">Imprint</a>
            <a href="https://www.mimacom.com/en/privacy-policy/" target="_blank">Privacy</a>
          </div>
        </section>

        <a
          href="https://www.mimacom.com"
          target="_blank"
          rel="noreferrer noopener"
          className="fbOpenSource">
          <img
            src={`${this.props.config.baseUrl}img/mimacom_logo.svg`}
            alt="mimacom"
            width="170"
            height="45"
          />
        </a>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
