
export default class PubmedWindow {

  constructor(wm: any) {
    console.log(wm)
    wm.open(
      {
        title: 'Request More Tools',
        body: [
          {
            type: 'container',
            html: x,
          }
      ],
      buttons: [],
    });
  }

}


let x =
`<div style="text-align: center;">
  Have a feature or tool in mind that isn't available?<br>
  <a
  href="https://github.com/dsifford/academic-bloggers-toolkit/issues"
  style="color: #00a0d2;"
  target="_blank">Open an issue</a> on the GitHub repository and let me know!
</div>`;
