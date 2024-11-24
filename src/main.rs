use actix_files::Files;
use actix_web::{App, HttpServer};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Server gestart op http://192.168.68.97:2800");

    HttpServer::new(|| App::new().service(Files::new("/", "./public").index_file("index.html")))
        .bind("192.168.68.97:2800")?
        .run()
        .await
}
