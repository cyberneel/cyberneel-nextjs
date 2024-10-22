import * as Icon from 'react-bootstrap-icons';

function Footer() {
  
  
  return(
    <>
    <div class="p-3"></div>
  <footer class="bg-dark text-center text-white rounded-3">

  <div class="container p-4 pb-0">

    <section class="mb-4">

      <a class="btn btn-outline-light btn-floating m-1" href="https://boulderbugle.com/my-google-profile-Qr6XopIM" role="button"
        ><Icon.Question />
      </a>


      <a class="btn btn-outline-light btn-floating m-1" href="https://instagram.com/cyber_neel" role="button"
        ><Icon.Instagram />
       </a>


      <a class="btn btn-outline-light btn-floating m-1" href="https://github.com/cyberneel" role="button"
        ><Icon.Github />
      </a>
    </section>

  </div>



  <div class="text-center p-3 bg-dark" >
    © 2024 Copyright:&nbsp;
    <a class="text-white" href="#">Neelesh Chevuri</a>
  </div>

</footer>

</>
  );
  
} export default Footer;