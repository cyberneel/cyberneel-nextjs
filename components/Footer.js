import Icon from './Icon';

function Footer() {
  
  
  return(
    <>

  <footer class="bg-dark text-center text-white pt-3">

  <div class="container p-4 pb-0">

    <section class="mb-4">

      <a class="btn btn-outline-light btn-floating m-1" href="#!" role="button"
        ><Icon
      iconName="google"
      color="royalblue"
      size={96}
      className="align-top"
    />
      </a>


      <a class="btn btn-outline-light btn-floating m-1" href="#!" role="button"
        ><i class="fab fa-instagram"></i
      ></a>


      <a class="btn btn-outline-light btn-floating m-1" href="#!" role="button"
        ><i class="fab fa-github"></i
      ></a>
    </section>

  </div>



  <div class="text-center p-3 bg-dark" >
    © 2020 Copyright:&nbsp;
    <a class="text-white" href="#">Neelesh Chevuri</a>
  </div>

</footer>

</>
  );
  
} export default Footer;