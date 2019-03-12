import mOrm from "./mOrm";
import Student from "./entities/student";

(async () => {
    const orm = new mOrm();
    try{
        await orm.createConnection({
            "uri": "postgres://20180202:@localhost:5432/iLovePragmatic"
        },
        {
          entities: [Student]
        }); 

        let student = {
            firstname: 'Yassine',
            lastname: 'Fatihi'
        }
          
        const studentEntity = orm.getEntity('Student')
        // orm.dbInstance.dump();

        //OK SAVE
        const saved = await studentEntity.save(student)
        console.log(`New student ${student.firstname}`)

        //OK COUNT
        const count = await studentEntity.count()
        console.log(`There are ${count} student(s)`);

        //OK FINDBYPK
        const stud = await studentEntity.findByPk(2);
        console.log(stud);

        //OK FINDALL
        const everyone = await studentEntity.findAll();
        console.log(everyone);

        //OK REMOVE
        const toDelete = await studentEntity.remove(2);
        console.log(toDelete);

        //OK FINDONE
        // const findOne = await studentEntity.findOne();
        const findOne = await studentEntity.findOne({attributes:['firstname','lastname'], where: {id: 1}});
        console.log(findOne);

        //OK UPDATE
        const update = await studentEntity.update({attributes: {firstname: 'Yassine', lastname: 'lamenace'}, where: {id: 1}});
        console.log(update);

    } catch(err) {
        // console.log(err);
        process.exit(-1);
    }
})();