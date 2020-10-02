const year: number = new Date().getFullYear();

const welcomeTemplate = () => {
  return `
  <div>
    <div class="granger__mail-content" style="padding: 5% 10%;">
      <div style="text-align: center;">
        <img src="https://i.imgur.com/HEeurWs.png" alt="Granger" style="width: 150px;" />
      </div>
      <h2 style="text-align: center;"><i>Tristes noticias </i>☹️</h2>
      <h3>Hola estimadio usuario,</h3>
      <p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Este libro ha sido eliminado de <a style="color: #cf56a1; font-weight: bold;text-decoration: none;" href="http://www.granger.juancode.com.ve">Granger</a>. Por tal motivo se lo hemos enviado nuevamente.
      </p>
      <h3 style="text-align: center;"><i>Cuidalo bien.</i></h3>
    </div>
    <footer style="text-align: center;background-color: #e8e8e8;padding: 5px 0px;color: #424242;">
      <p style="margin: 5px;">
        <i
          >Copyright © ${year}
          <a style="color: #cf56a1; font-weight: bold;text-decoration: none;" href="http://www.granger.juancode.com.ve">Granger</a>
        </i>
      </p>
      <p style="margin: 5px;"><i>Venezuela, Nueva Esparta</i></p>
      <p style="margin: 5px;"><i>All rights reserved.</i></p>
    </footer>
  </div>
`;
};

export default welcomeTemplate;
