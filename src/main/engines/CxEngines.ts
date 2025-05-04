// interface Api {
//     api_url: string;
//     api_name: string;
//     description: string;
//   }
  
//   interface Engine {
//     engine_id: string;
//     engine_name: string;
//     apis: Api[];
//   }
  
//    class EngineCollection {
//     engines: Engine[];
  
//     constructor(data: any) {
//       this.engines = data.engines.map((engine: any) => ({
//         engine_id: engine.engine_id,
//         engine_name: engine.engine_name,
//         apis: engine.apis.map((api: any) => ({
//           api_url: api.api_url,
//           api_name: api.api_name,
//           description: api.description,
//         })),
//       }));
//     }
//   }


//   type Engine = {
//     engine_id: string;
//     engine_name: string;
//     apis: Array<{
//         api_url: string;
//         api_name: string;
//         description: string;
//     }>;
// };

// export default class DataParser {
//     private rawData: any;

//     constructor(rawData: any) {
//         this.rawData = data;
//     }

//     public static getParsedData(rawData: any): Array<Engine> {
//       this.rawData=rawData
//         return this.rawData.engines.map((data: any) => ({
//             engine_id: engine.engine_id,
//             engine_name: engine.engine_name,
//             apis: engine.apis.map((api: any) => ({
//                 api_url: api.api_url,
//                 api_name: api.api_name,
//                 description: api.description
//             }))
//         }));
//     }
// }






interface Api {
    api_url: string;
    api_name: string;
    description: string;
  }
  
  interface Engine {
    engine_id: string;
    engine_name: string;
    apis: Api[];
  }
  
  export default class EngineParser {
    public static parseEngine(json: any): Engine[] {
      if (json && Array.isArray(json.engines)) {
        return json.engines.map((engine: any) => ({
          engine_id: engine.engine_id,
          engine_name: engine.engine_name,
          apis: engine.apis.map((api: any) => ({
            api_url: api.api_url,
            api_name: api.api_name,
            description: api.description
          }))
        }));
      } else {
        throw new Error("Invalid JSON format");
      }
    }
  }
  

  