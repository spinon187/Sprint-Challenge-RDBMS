
exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('projects', function(tbl){
            tbl.increments('id');
            tbl.string('name', 128).notNullable().unique();
            tbl.string('description').notNullable();
            tbl.boolean('complete', false)
            tbl.timestamps(true, true);            
        })
        .createTable('actions', function(tbl){
            tbl.increments('id');
            tbl.string('name', 128).notNullable().unique();
            tbl
                .string('project_id')
                .unsigned()
                .references('id')
                .inTable('projects')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
                .notNullable();
            tbl.string('description').notNullable();
            tbl.string('notes');
            tbl.boolean('complete', false)
            tbl.timestamps(true, true);
        })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('projects').dropTableIfExists('actions');
};
