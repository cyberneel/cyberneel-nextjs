import * as Icon from 'react-bootstrap-icons';

function Footer() {
  
  
  return(
    <>
    <div className="p-3"></div>
  <footer className="bg-dark text-center text-white rounded-3">

  <div className="container p-4 pb-0">

    <section className="mb-4">

      <a className="btn btn-outline-light btn-floating m-1" href="https://social.mtdv.me/blog/posts/google-plus-profile" role="button"
        ><Icon.GooglePlay />
      </a>

      <a className="btn btn-outline-light btn-floating m-1" href="https://linkedin.cyberneel.com/" role="button"
        ><Icon.Linkedin />
      </a>

      <a className="btn btn-outline-light btn-floating m-1" href="https://instagram.com/cyber_neel" role="button"
        ><Icon.Instagram />
       </a>


      <a className="btn btn-outline-light btn-floating m-1" href="https://github.com/cyberneel" role="button"
        ><Icon.Github />
      </a>
    </section>

  </div>



  <div className="text-center p-3 bg-dark" >
    © {new Date().getFullYear()} Copyright:&nbsp;
    <a className="text-white" href="#">Neelesh Chevuri</a>
  </div>

</footer>

</>
  );
  
} export default Footer;