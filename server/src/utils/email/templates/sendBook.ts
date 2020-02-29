const year: number = new Date().getFullYear();

const welcomeTemplate = (name: string) => {
  return `
  <div>
    <div class="granger__mail-content" style="padding: 5% 10%;">
      <div style="text-align: center;">
        <img src="https://api.granger.juancode.com.ve/public/granger.png" alt="Granger" style="width: 150px;" />
      </div>
      <h2 style="text-align: center;"><i>Gracias por su compra ⭐</i></h2>
      <h3>Hola ${name},</h3>
      <p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Este es tu nuevo amigo, esperamos pases mucho tiempo junto a él, ¡Diviértanse!
      </p>
      <h3 style="text-align: center;"><i>Feliz lectura.</i></h3>
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
