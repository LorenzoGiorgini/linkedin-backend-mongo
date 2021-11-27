import PdfPrinter from "pdfmake";
import fetch from "node-fetch";

import path from "path";

const { extname } = path


const fetchImage = async (data) => {
    
    let resp = await fetch(data , 
        { 
            responseType: "arraybuffer" 
        }
    )

    return resp.arrayBuffer()
}


const convertImageBase64 =  async (data) => {

    let imageBuffer = await fetchImage(data.image)

    const base64String = Buffer.from(imageBuffer).toString("base64")
    
    const imageUrlPath = data.image.split('/')
    
    const fileName = imageUrlPath[imageUrlPath.length - 1]
    
    const extension = extname(fileName)
    
    const baseUrl = `data:image/${extension};base64,${base64String}`
    
    return baseUrl
}


export const createPDF = async (data) => {
   

    const fonts = {
        Helvetica: {
            normal: "Helvetica",
            bold: "Helvetica-Bold",
            italics: "Helvetica-Oblique",
            bolditalics: "Helvetica-BoldOblique",
        },
    };


    let printer = new PdfPrinter(fonts);


    if(data.image) {
        
        const base64UrlPDF = await convertImageBase64(data)

        let docDefinition = {
            content: [
                {
                    image: base64UrlPDF,
                    width: "500"
                },
                {
                    text: `${data.name}`,
                    style: "header"
                },
                {
                    text: [
                        `${data}`
                        ],
                    style: 'description'
                }
            ],
            defaultStyle: {
                font: "Helvetica"
            },
            styles: {
                header: {
                    fontSize: 20,
                    bold: true
                },
                description: {
                    fontSize: 16,
                    bold: false
                }
            }
        }
        
        let options = {
            
        }
          
        let pdfStream = printer.createPdfKitDocument(docDefinition, options);
    
        pdfStream.end()
    
        return pdfStream
    }
}