const year: number = new Date().getFullYear();

const welcomeTemplate = (name: string) => {
  return `
  <div>
    <header style="background-color: #cf56a1;padding: 4px 0;text-align: center;color: #fff;">
      <h1>Bienvenido a Granger 📖</h1>
    </header>
    <div class="granger__mail-content" style="padding: 5% 10%;">
      <h2 style="text-align: center;"><i>¡Felicidades por crear tu cuenta!🎉</i></h2>
      <div style="text-align: center;">
        <img src="cid:logo" alt="Granger" />
      </div>
      <h3>Hola ${name},</h3>
      <p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Busca tu libro favorito en
        <a style="color: #cf56a1; font-weight: bold;text-decoration: none;" href="http://www.granger.juancode.com">Granger</a>, ponte cómodo y
        manos a la obra.
      </p>
      <p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Si aún no sabe qué leer, recuerda que tenemos una lista de libros
        destacados, elige sin miedo ya que cada libro es una historia nueva en tus
        manos.
      </p>
      <h3 style="text-align: center;"><i>Feliz lectura.</i></h3>
    </div>
    <footer style="text-align: center;background-color: #e8e8e8;padding: 5px 0px;color: #424242;">
      <p style="margin: 5px;">
        <i
          >Copyright © ${year}
          <a style="color: #cf56a1; font-weight: bold;text-decoration: none;" href="http://www.granger.juancode.com">Granger</a>
        </i>
      </p>
      <p style="margin: 5px;"><i>Venezuela, Nueva Esparta</i></p>
      <p style="margin: 5px;"><i>All rights reserved.</i></p>
    </footer>
  </div>
`;
};

export default welcomeTemplate;
