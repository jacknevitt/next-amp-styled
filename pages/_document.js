import Document, { Head } from 'next/document'
import { ServerStyleSheet } from "styled-components";
import { Body } from '../theme'

const getStyleTag = sheet => {
  const styleTags = sheet.getStyleElement()
  const styleTagsArray = Array.isArray(styleTags) ? styleTags : [styleTags];
  const inlineCss = styleTagsArray.reduce((inlineStyles, currentStylesheet) => {
    if (currentStylesheet && currentStylesheet.props) {
      return `${inlineStyles}${
        currentStylesheet.props.dangerouslySetInnerHTML.__html
        }`;
    }
    return inlineStyles;
  }, '')

  return (
    <style amp-custom="" dangerouslySetInnerHTML={{ __html: inlineCss }} />
  )
}

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()

    try {
      const initialProps = await Document.getInitialProps(ctx)

      const finalProps = {
        ...initialProps,
        styleTag: getStyleTag(sheet)
      }
      return finalProps;
    }
    finally {
      sheet.seal()
    }
  }
  render() {
    const { html, styleTag } = this.props
    return (
      <html amp=''>
        <Head>
          <link rel='canonical' href='/' />
          <meta name='viewport' content='width=device-width,minimum-scale=1' />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css?family=Roboto'
          />
          <style amp-boilerplate=''>{`body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`}</style>
          <noscript>
            <style amp-boilerplate=''>{`body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`}</style>
          </noscript>
          {styleTag}
          <script async src='https://cdn.ampproject.org/v0.js' />
        </Head>
        <Body>
          <div id='__next' dangerouslySetInnerHTML={{ __html: html }} />
        </Body>
      </html>
    )
  }
}
